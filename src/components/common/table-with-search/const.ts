export interface SearchListItem {
  prop: string;
  label: string;
  labelWidth?: string;
  componentKey: string; // input / date-picker
  value: any;
  default?: any;
  [key: string]: any;
}
