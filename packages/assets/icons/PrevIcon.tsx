import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const PrevIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={9} height={16} viewBox="0 0 9 16" fill="none">
      <path
        d="M7.5 1.667L1.166 8 7.5 14.334"
        stroke="currentColor"
        strokeWidth={2.1112}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PrevIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={PrevIconSVG} {...props} />;
};
