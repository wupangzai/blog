export interface SearchListItem {
  prop: string;
  label: string;
  componentKey: string; // input / date-picker
  value: any;
  default?: any;
  [key: string]: any;
}
