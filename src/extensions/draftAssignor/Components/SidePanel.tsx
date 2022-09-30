import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import PanelBody from './PanelBody';

export default class SidePanel extends BaseDialog {

    public context = null;
    public person = null;
    public selectedRows = [];  
    public domEntity: HTMLDivElement = null;
    constructor(context, person, selectedRows){
        super();
        this.context = context;
        this.person = person;
        this.selectedRows = selectedRows;
        // console.log("context", this.context);
    }

  public render(): void {
    var x = document.getElementsByClassName("ms-Dialog-main");
    // x.item(0).setAttribute("hidden", "true");
    // console.log(this.isOpen);

    ReactDOM.render(
        <PanelBody dialogClose = {this.close} context={this.context} selectedPerson={this.person} selectedRows={this.selectedRows} />
    
    , this.domElement);
  }  
}