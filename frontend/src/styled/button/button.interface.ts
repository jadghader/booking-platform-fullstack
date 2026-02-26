export interface IButtonProps {
  buttonName: string;
  onClick: any;
  className?: string;
  id?: string;
  disabled: boolean;
}

export interface ISubmitButtonProps {
  buttonName: string;
  disabled?: boolean;
  className?: any;
}

export interface ISubmitViewButtonProps {
  buttonName: string;
  disabled?: boolean;
  className?: any;
  endIcon: any;
}
export interface IUploadButtonProps {
  buttonName: string;
  onChange: any;
  style: any;
  accept: string;
}

export interface IOutlinedButtonProps {
  buttonName: string;
  onClick: any;
  className?: string;
  disabled?: boolean;
}
