import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog} from '@microsoft/sp-dialog';
import ErrorDialogBody from './ErrorDialogBody';

export default class ErrorDialog extends BaseDialog {

    public context = null;
    public reason = null;
    public selectedRows = [];  
    public domEntity: HTMLDivElement = null;
    constructor(context, reason, selectedRows){
        super();
        this.context = context;
        this.reason = reason;
        this.selectedRows = selectedRows;
        // console.log("context", this.context);
    }

  public render(): void {
    var x = document.getElementsByClassName("ms-Dialog-main");
    // x.item(0).setAttribute("hidden", "true");
    // console.log(this.isOpen);

    ReactDOM.render(
        <ErrorDialogBody context={this.context} dialogClose={this.close} errorReason={this.reason} selectedRows={this.selectedRows} />
    
    , this.domElement);
  }  
}