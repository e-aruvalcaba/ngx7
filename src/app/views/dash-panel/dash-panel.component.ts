import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent{

  @Input() title: string;
  @Input() public urlLink: string;
  @Input() public urlMessage: string;
  @Input() public cmxIcon: string;

  constructor(){}
  ngOnInit(){}
} // end class DashPanelComponent
