import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const AddIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={25} viewBox="0 0 24 25" fill="none">
      <path
        d="M6 12.5h12M12 18.5v-12"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const AddIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={AddIconSVG} {...props} />;
};
