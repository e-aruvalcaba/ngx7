import { Directive, OnChanges, Input, SimpleChanges, EventEmitter} from '@angular/core';

@Directive({
  // selector: '[appCmxDataTableColumn]'
  selector: 'cmx-data-table-column',
  inputs: [
    'header',
    'property',
    'editModeType',
    'isEditable',
    'valueProperty',
    'displayProperty',
    'labelProperty',
    'expandedProperties',
    'expandedHeaders',
    'max',
    'min',
    'maxlength',
    'minlength',
    'required',
    'inputType',
    'pattern',
    'visible',
    'width',
    'isAddable',
  ],
  outputs: [
    'onChanged'
  ]
})
export class CmxDataTableColumnDirective implements OnChanges {

  onChanged = new EventEmitter();

  @Input() public datasource: any[];

  header: string;
  property: string;
  editModeType: string;
  isEditable: boolean = true;
  valueProperty: string;
  displayProperty: string;
  labelProperty : string;
  expandedProperties : string;
  expandedHeaders : string;
  max : number;
  min : number;
  maxlength : number;
  minlength : number;
  required : boolean;
  inputType : string;
  pattern : string;
  visible : boolean;
  width : number;
  isAddable : boolean = true;

  constructor() {}
  /**
   * Implements OnChanges
   */
  ngOnChanges(changes: SimpleChanges){
    if (changes.datasource) {
      this.onChanged.emit({
        property: this.property,
        datasource: changes.datasource.currentValue
      }); // end emit
    } // end if
  } // end function onChanges
} // end class tablecolumn
