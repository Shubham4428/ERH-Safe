import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, debounceTime, map, switchMap, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';


export interface Patient_Name {
  ID: number;
  name: string;
}
const PATIENTDATA: Patient_Name[] = [
  { ID: 1, name: 'Rajkumar' },
  { ID: 2, name: 'Ashok' },
  { ID: 3, name: 'Akash' },
];

export interface HealthRecord {
  name: string;
  symptom: string;
  date: any;
  updatedBy: string;
  description: string;
}

const healthRecord: HealthRecord[] = [
  { name: 'Rajkumar', symptom: 'Headache', date: '01 Oct 2023', updatedBy: 'Doctor A', description: 'Pain relievers prescribed. Pain relievers prescribed' },
  { name: 'Rajkumar', symptom: 'Headache', date: '02 Oct 2023', updatedBy: 'Doctor B', description: 'Pain relievers prescribed' },
  { name: 'Rajkumar', symptom: 'Headache', date: '03 Oct 2023', updatedBy: 'Doctor C', description: 'Pain relievers prescribed. Pain relievers prescribed' },
  { name: 'Rajkumar', symptom: 'Headache', date: '04 Oct 2023', updatedBy: 'Doctor D', description: 'Pain relievers prescribed' },
  { name: 'Ashok', symptom: 'Headache', date: '05 Oct 2023', updatedBy: 'Doctor Ram', description: 'Pain relievers prescribed. Pain relievers prescribed' },
  { name: 'Ashok', symptom: 'Headache', date: '06 Oct 2023', updatedBy: 'Doctor Sita', description: 'Pain relievers prescribed' },
]
@Component({
  selector: 'app-health-record',
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.scss']
})
export class HealthRecordComponent {


  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;
  isScreenSmall: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  searchUserForm: FormGroup;
  searchUserForm1: FormGroup;

  Patient: Patient_Name[] = [];
  healthRecord: HealthRecord[] = [];
  selectedPatientData: any
  selectedPatient: string | null = null;

  searchText: string = '';
  searchname: string = '';
  currentPage: number = 1;
  pageSize: number = 2;

  /**
  * Constructor
  */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private fb: FormBuilder
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });

    this.Patient = PATIENTDATA;
    console.log('this.Patient', this.Patient);

    this.healthRecord = healthRecord

    // Set default patient (for example, the first patient in the array)
    const defaultPatientName = this.Patient.length > 0 ? this.Patient[0].name : '';

    // Call showHealthDetails with the default patient
    this.showHealthDetails(defaultPatientName);
  }

  showHealthDetails(patientName: string): void {
    this.selectedPatient = patientName;
    // Assuming healthRecord is an array containing all health records
    this.selectedPatientData = this.healthRecord.filter(record => record.name === patientName);
    console.log(this.selectedPatientData, 'selectedPatientData');

  }

  get filteredCardData() {
    return this.selectedPatientData.filter(data =>
      data.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      data.date.toLowerCase().includes(this.searchText.toLowerCase()) ||
      data.symptom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      data.updatedBy.toLowerCase().includes(this.searchText.toLowerCase()) ||
      data.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get searchpatientname() {
    return this.Patient.filter(data =>
      data.name.toLowerCase().includes(this.searchname.toLowerCase())
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCardData.length / this.pageSize);
  }

  get pagedCardData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredCardData.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  isSelected(patientName: string): boolean {
    return this.selectedPatient === patientName;
  }


}
