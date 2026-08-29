import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { TabsModule } from 'primeng/tabs';
import { GateService, ScanHistoryFilters } from '../../../../core/services/gate.service';
import { Gate, GateDetail, GateScanHistoryEntry, GateUserSummary } from '../../../../core/models/models';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SkeletonTable } from '../../../../shared/components/skeleton/skeleton';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

type GateTab = 'gates' | 'users' | 'history';

@Component({
  selector: 'app-admin-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmptyState,
    SkeletonTable,
    ConfirmDialog,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    TableModule,
    SelectModule,
    MultiSelectModule,
    DialogModule,
    FluidModule,
    TabsModule,
  ],
  templateUrl: './admin-gates.html',
  styleUrl: './admin-gates.scss',
})
export class AdminGates implements OnInit {
  activeTab = signal<GateTab>('gates');

  // ---------------------------------------------------------------------
  // Gates tab
  // ---------------------------------------------------------------------
  gates = signal<Gate[]>([]);
  gatesTotal = signal(0);
  gatesLoading = signal(true);
  gateSearch = '';
  gateStatusFilter = signal<'' | 'Active' | 'Inactive'>('');
  gatesError = signal<string | null>(null);
  togglingGateId = signal<number | null>(null);
  deletingGateId = signal<number | null>(null);
  pendingDeleteGate = signal<Gate | null>(null);

  gateDialogOpen = signal(false);
  gateDialogEditing = signal<Gate | null>(null);
  gateFormName = '';
  gateFormDescription = '';
  savingGate = signal(false);
  gateFormError = signal<string | null>(null);

  gateOptions = computed(() => this.gates().map((g) => ({ label: g.name, value: g.gateId })));

  // ---------------------------------------------------------------------
  // Assign-users dialog (opened from a Gates-tab row)
  // ---------------------------------------------------------------------
  assignDialogGate = signal<GateDetail | null>(null);
  assignDialogLoading = signal(false);
  assignError = signal<string | null>(null);
  addingUser = signal(false);
  removingUserId = signal<number | null>(null);
  selectedUserToAdd: number | null = null;

  availableUsersForAssign = computed(() => {
    const detail = this.assignDialogGate();
    if (!detail) return [];
    const assignedIds = new Set(detail.assignedUsers.map((u) => u.userId));
    return this.gateUsers()
      .filter((u) => !assignedIds.has(u.userId))
      .map((u) => ({ label: `${u.fullName} (${u.email})`, value: u.userId }));
  });

  // ---------------------------------------------------------------------
  // Gate Users tab
  // ---------------------------------------------------------------------
  gateUsers = signal<GateUserSummary[]>([]);
  gateUsersTotal = signal(0);
  gateUsersLoading = signal(true);
  gateUserSearch = '';
  gateUsersError = signal<string | null>(null);

  userDialogOpen = signal(false);
  newUserFullName = '';
  newUserEmail = '';
  newUserPassword = '';
  newUserGateIds: number[] = [];
  savingUser = signal(false);
  userFormError = signal<string | null>(null);

  private readonly gateNameById = computed(() => new Map(this.gates().map((g) => [g.gateId, g.name])));

  // ---------------------------------------------------------------------
  // Scan History tab
  // ---------------------------------------------------------------------
  historyEntries = signal<GateScanHistoryEntry[]>([]);
  historyTotal = signal(0);
  historyLoading = signal(true);
  historyGateFilter = signal<number | null>(null);
  historyStatusFilter = signal<'' | 'Success' | 'Failed'>('');
  historyFromDate = '';
  historyToDate = '';

  readonly statusFilterOptions = [
    { label: 'All statuses', value: '' as const },
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
  ];

  readonly historyStatusOptions = [
    { label: 'All statuses', value: '' as const },
    { label: 'Success', value: 'Success' as const },
    { label: 'Failed', value: 'Failed' as const },
  ];

  historyGateOptions = computed(() => [{ label: 'All gates', value: null as number | null }, ...this.gateOptions()]);

  constructor(private gateService: GateService) {}

  ngOnInit(): void {
    this.loadGates();
    this.loadGateUsers();
    this.loadHistory();
  }

  selectTab(tab: string | number | undefined): void {
    if (tab === 'gates' || tab === 'users' || tab === 'history') {
      this.activeTab.set(tab);
    }
  }

  // ---------------------------------------------------------------------
  // Gates tab
  // ---------------------------------------------------------------------
  loadGates(): void {
    this.gatesLoading.set(true);
    this.gateService.gates(this.gateSearch || undefined, this.gateStatusFilter() || undefined, 1, 100).subscribe({
      next: (res) => {
        this.gates.set(res.items);
        this.gatesTotal.set(res.total);
        this.gatesLoading.set(false);
      },
      error: () => this.gatesLoading.set(false),
    });
  }

  openCreateGate(): void {
    this.gateDialogEditing.set(null);
    this.gateFormName = '';
    this.gateFormDescription = '';
    this.gateFormError.set(null);
    this.gateDialogOpen.set(true);
  }

  openEditGate(g: Gate): void {
    this.gateDialogEditing.set(g);
    this.gateFormName = g.name;
    this.gateFormDescription = g.description ?? '';
    this.gateFormError.set(null);
    this.gateDialogOpen.set(true);
  }

  closeGateDialog(): void {
    this.gateDialogOpen.set(false);
  }

  saveGate(): void {
    if (!this.gateFormName.trim()) {
      this.gateFormError.set('Name is required.');
      return;
    }
    this.gateFormError.set(null);
    this.savingGate.set(true);
    const editing = this.gateDialogEditing();
    const description = this.gateFormDescription.trim() || undefined;
    const obs: Observable<unknown> = editing
      ? this.gateService.updateGate(editing.gateId, this.gateFormName.trim(), description)
      : this.gateService.createGate(this.gateFormName.trim(), description);
    obs.subscribe({
      next: () => {
        this.savingGate.set(false);
        this.gateDialogOpen.set(false);
        this.loadGates();
      },
      error: (err) => {
        this.savingGate.set(false);
        this.gateFormError.set(err.error?.message ?? 'Could not save this gate.');
      },
    });
  }

  toggleGateStatus(g: Gate): void {
    this.gatesError.set(null);
    this.togglingGateId.set(g.gateId);
    this.gateService.setGateStatus(g.gateId, g.status !== 'Active').subscribe({
      next: () => {
        this.togglingGateId.set(null);
        this.loadGates();
      },
      error: (err) => {
        this.togglingGateId.set(null);
        this.gatesError.set(err.error?.message ?? 'Could not update this gate.');
      },
    });
  }

  requestDeleteGate(g: Gate): void {
    this.gatesError.set(null);
    this.pendingDeleteGate.set(g);
  }

  confirmDeleteGate(): void {
    const g = this.pendingDeleteGate();
    if (!g) return;
    this.pendingDeleteGate.set(null);
    this.deletingGateId.set(g.gateId);
    this.gateService.deleteGate(g.gateId).subscribe({
      next: () => {
        this.deletingGateId.set(null);
        this.loadGates();
      },
      error: (err) => {
        this.deletingGateId.set(null);
        this.gatesError.set(err.error?.message ?? 'Could not delete this gate.');
      },
    });
  }

  // ---------------------------------------------------------------------
  // Assign-users dialog
  // ---------------------------------------------------------------------
  openAssignDialog(g: Gate): void {
    this.assignError.set(null);
    this.selectedUserToAdd = null;
    this.assignDialogLoading.set(true);
    this.assignDialogGate.set(null);
    this.gateService.gate(g.gateId).subscribe({
      next: (detail) => {
        this.assignDialogLoading.set(false);
        this.assignDialogGate.set(detail);
      },
      error: () => {
        this.assignDialogLoading.set(false);
      },
    });
  }

  closeAssignDialog(): void {
    this.assignDialogGate.set(null);
  }

  private refreshAssignDialog(): void {
    const detail = this.assignDialogGate();
    if (!detail) return;
    this.gateService.gate(detail.gateId).subscribe((refreshed) => this.assignDialogGate.set(refreshed));
    this.loadGates();
  }

  addUserToGate(): void {
    const detail = this.assignDialogGate();
    if (!detail || this.selectedUserToAdd === null) return;
    this.assignError.set(null);
    this.addingUser.set(true);
    this.gateService.assignGateUser(detail.gateId, this.selectedUserToAdd).subscribe({
      next: () => {
        this.addingUser.set(false);
        this.selectedUserToAdd = null;
        this.refreshAssignDialog();
      },
      error: (err) => {
        this.addingUser.set(false);
        this.assignError.set(err.error?.message ?? 'Could not assign this user.');
      },
    });
  }

  removeUserFromGate(userId: number): void {
    const detail = this.assignDialogGate();
    if (!detail) return;
    this.assignError.set(null);
    this.removingUserId.set(userId);
    this.gateService.removeGateUser(detail.gateId, userId).subscribe({
      next: () => {
        this.removingUserId.set(null);
        this.refreshAssignDialog();
      },
      error: (err) => {
        this.removingUserId.set(null);
        this.assignError.set(err.error?.message ?? 'Could not remove this user.');
      },
    });
  }

  // ---------------------------------------------------------------------
  // Gate Users tab
  // ---------------------------------------------------------------------
  loadGateUsers(): void {
    this.gateUsersLoading.set(true);
    this.gateService.gateUsers(this.gateUserSearch || undefined, 1, 100).subscribe({
      next: (res) => {
        this.gateUsers.set(res.items);
        this.gateUsersTotal.set(res.total);
        this.gateUsersLoading.set(false);
      },
      error: () => this.gateUsersLoading.set(false),
    });
  }

  gateNamesFor(u: GateUserSummary): string {
    if (u.gateIds.length === 0) return 'None';
    const lookup = this.gateNameById();
    return u.gateIds.map((id) => lookup.get(id) ?? `#${id}`).join(', ');
  }

  openCreateUser(): void {
    this.newUserFullName = '';
    this.newUserEmail = '';
    this.newUserPassword = '';
    this.newUserGateIds = [];
    this.userFormError.set(null);
    this.userDialogOpen.set(true);
  }

  closeUserDialog(): void {
    this.userDialogOpen.set(false);
  }

  saveUser(): void {
    if (!this.newUserFullName.trim() || !this.newUserEmail.trim() || !this.newUserPassword) {
      this.userFormError.set('Name, email, and password are required.');
      return;
    }
    this.userFormError.set(null);
    this.savingUser.set(true);
    this.gateService
      .createGateUser(this.newUserFullName.trim(), this.newUserEmail.trim(), this.newUserPassword, this.newUserGateIds)
      .subscribe({
        next: () => {
          this.savingUser.set(false);
          this.userDialogOpen.set(false);
          this.loadGateUsers();
          this.loadGates();
        },
        error: (err) => {
          this.savingUser.set(false);
          this.userFormError.set(err.error?.message ?? 'Could not create this gate user.');
        },
      });
  }

  // ---------------------------------------------------------------------
  // Scan History tab
  // ---------------------------------------------------------------------
  loadHistory(): void {
    this.historyLoading.set(true);
    const filters: ScanHistoryFilters = {};
    const gateId = this.historyGateFilter();
    if (gateId) filters.gateId = gateId;
    if (this.historyStatusFilter()) filters.status = this.historyStatusFilter() as 'Success' | 'Failed';
    if (this.historyFromDate) filters.fromUtc = new Date(this.historyFromDate).toISOString();
    if (this.historyToDate) filters.toUtc = new Date(`${this.historyToDate}T23:59:59`).toISOString();
    this.gateService.scanHistory(filters, 1, 100).subscribe({
      next: (res) => {
        this.historyEntries.set(res.items);
        this.historyTotal.set(res.total);
        this.historyLoading.set(false);
      },
      error: () => this.historyLoading.set(false),
    });
  }

  clearHistoryFilters(): void {
    this.historyGateFilter.set(null);
    this.historyStatusFilter.set('');
    this.historyFromDate = '';
    this.historyToDate = '';
    this.loadHistory();
  }
}
