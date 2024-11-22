import SideForm from "../SideForm";
import SmartFormWrapper, { SmartFormWrapperProps } from "../SmartForm";

interface SmartSideFormProps extends SmartFormWrapperProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SmartSideForm(props: SmartSideFormProps) {
  const { title, isOpen, onClose, ...extraProps } = props;

  return (
    <SideForm title={title} isOpen={isOpen} onClose={onClose}>
      <SmartFormWrapper {...extraProps} />
    </SideForm>
  );
}

export default SmartSideForm;
