export interface SearchListItem {
  key: string;
  label: string;
  componentKey: string; // input / date-picker
  value: any;
  [key: string]: any;
}
