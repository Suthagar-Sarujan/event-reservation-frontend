import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BrowserQRCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { GateScanService } from '../../../../core/services/gate-scan.service';
import { GateSessionService } from '../../../../core/services/gate-session.service';
import { GateScanResult, GateScanType } from '../../../../core/models/models';

// How long the color-coded result banner stays up before scanning resumes on
// its own - the user can also tap "Scan next" to resume immediately.
const RESUME_DELAY_MS = 2500;

@Component({
  selector: 'app-gate-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, MessageModule, SelectButtonModule],
  templateUrl: './gate-scanner.html',
  styleUrl: './gate-scanner.scss',
})
export class GateScanner implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElementRef?: ElementRef<HTMLVideoElement>;

  cameraActive = signal(false);
  cameraError = signal<string | null>(null);
  // Locked while a scan request is in flight or its result is being shown -
  // blocks both repeat camera decodes of the same frame and manual re-submits.
  locked = signal(false);
  result = signal<GateScanResult | null>(null);
  manualCode = '';
  submittingManual = signal(false);

  scanMode = signal<GateScanType>('CheckIn');
  readonly scanModeOptions: { label: string; value: GateScanType }[] = [
    { label: 'Check In', value: 'CheckIn' },
    { label: 'Check Out', value: 'CheckOut' },
  ];

  private redirected = false;
  private readonly codeReader = new BrowserQRCodeReader();
  private controls: IScannerControls | null = null;
  private resumeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private gateScanService: GateScanService,
    protected gateSession: GateSessionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.gateSession.isComplete()) {
      this.redirected = true;
      this.router.navigate(['/gate']);
    }
  }

  ngAfterViewInit(): void {
    if (this.redirected) return;
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
  }

  private async startCamera(): Promise<void> {
    const video = this.videoElementRef?.nativeElement;
    if (!video) return;
    try {
      this.cameraError.set(null);
      this.controls = await this.codeReader.decodeFromVideoDevice(undefined, video, (decodeResult) => {
        if (!decodeResult || this.locked()) return;
        this.submitScan(decodeResult.getText().trim());
      });
      this.cameraActive.set(true);
    } catch {
      // Permission denied, no camera available, insecure context, etc. -
      // fall back to manual entry as the primary path rather than leaving a
      // broken blank camera view up.
      this.cameraActive.set(false);
      this.cameraError.set('Could not access the camera. Use the code field below to check tickets in instead.');
    }
  }

  private stopCamera(): void {
    this.controls?.stop();
    this.controls = null;
    this.cameraActive.set(false);
  }

  submitManual(): void {
    const code = this.manualCode.trim();
    if (!code || this.locked()) return;
    this.submittingManual.set(true);
    this.submitScan(code, () => this.submittingManual.set(false));
  }

  private submitScan(code: string, onDone?: () => void): void {
    const gateId = this.gateSession.gateId();
    const eventId = this.gateSession.eventId();
    if (!code || gateId === null || eventId === null || this.locked()) {
      onDone?.();
      return;
    }
    this.locked.set(true);
    this.gateScanService.scan({ gateId, eventId, code, scanType: this.scanMode() }).subscribe({
      next: (res) => {
        this.result.set(res);
        this.manualCode = '';
        onDone?.();
        this.scheduleResume();
      },
      error: () => {
        this.result.set({
          success: false,
          message: 'Could not reach the server. Please try again.',
          bookingReference: null,
          attendeeName: null,
          eventName: null,
          scannedAt: null,
          totalQuantity: null,
        });
        onDone?.();
        this.scheduleResume();
      },
    });
  }

  private scheduleResume(): void {
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => this.resumeScanning(), RESUME_DELAY_MS);
  }

  resumeScanning(): void {
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
    this.result.set(null);
    this.locked.set(false);
  }

  changeSelection(): void {
    this.stopCamera();
    this.gateSession.clear();
    this.router.navigate(['/gate']);
  }

  resultClass(): string {
    const r = this.result();
    if (!r) return '';
    return r.success ? 'result-valid' : 'result-invalid';
  }
}
