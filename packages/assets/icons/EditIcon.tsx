import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const EditIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
      <path
        d="M13.385 3.6l-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16zM12.015 5.05a6.126 6.126 0 005.45 5.15M3.125 22h18"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const EditIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={EditIconSVG} {...props} />;
};
