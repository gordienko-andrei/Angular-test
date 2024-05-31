import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ErrorIssue } from '../interfaces/ErrorIssue';
import { CheckedStateInterface } from '../interfaces/CheckedStateInterface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class Table implements OnInit {
  @Input() issues: ErrorIssue[] = [];

  selectDeselectAllIsChecked = false;
  numCheckboxesSelected = 0;
  checkedState: CheckedStateInterface[] = [];

  ngOnInit() {
    this.checkedState = new Array(this.issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    });
  }

  getStylesTr(issue: ErrorIssue) {
    return issue.status === 'open' ? 'openIssue' : 'closedIssue';
  }

  onClick(index: number, issue: ErrorIssue) {
    if (issue.status === 'open') {
      this.handleOnChange(index);
    }
  }

  handleOnChange(position: number) {
    const updatedCheckedState = this.checkedState.map(
      (element: CheckedStateInterface, index: number) => {
        if (position === index) {
          const { checked } = element;
          const backgroundColor = checked ? '#ffffff' : '#eeeeee';
          return { ...element, checked: !checked, backgroundColor };
        }
        return element;
      }
    );
    this.checkedState = updatedCheckedState;
    const totalSelected = updatedCheckedState.filter((element: CheckedStateInterface) => element.checked).length;
    
    this.numCheckboxesSelected = totalSelected;
    this.handleIndeterminateCheckbox(totalSelected);
  }

  handleIndeterminateCheckbox(total: number) {
    const indeterminateCheckbox = document.getElementById(
      'custom-checkbox-selectDeselectAll'
    );
    let count = 0;

    this.issues.forEach((element: ErrorIssue) => {
      element.status === 'open' ? count++ : count;
    });

    if (total === 0) {
      (indeterminateCheckbox as HTMLInputElement).indeterminate = false;
      this.selectDeselectAllIsChecked = false;
    }
    if (total > 0 && total < count) {
      (indeterminateCheckbox as HTMLInputElement).indeterminate = true;
      this.selectDeselectAllIsChecked = false;
    }
    if (total === count) {
      (indeterminateCheckbox as HTMLInputElement).indeterminate = false;
      this.selectDeselectAllIsChecked = true;
    }
  }

  handleSelectDeselectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    const allTrueArray: CheckedStateInterface[] = [];

    this.issues.forEach((element: ErrorIssue) => {
      if (element.status === 'open') {
        allTrueArray.push({ checked: true, backgroundColor: '#eeeeee' });
      } else {
        allTrueArray.push({ checked: false, backgroundColor: '#ffffff' });
      }
    });

    const allFalseArray: CheckedStateInterface[] = new Array(this.issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    });

    checked ? this.checkedState = allTrueArray : this.checkedState = allFalseArray;
    
    const totalSelected = (checked ? allTrueArray : allFalseArray).filter((element: CheckedStateInterface) => element.checked).length;
    this.numCheckboxesSelected = totalSelected;
    this.selectDeselectAllIsChecked = !this.selectDeselectAllIsChecked;
  }
}
