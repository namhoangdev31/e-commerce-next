import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const NextIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={9} height={16} viewBox="0 0 9 16" fill="none">
      <path
        d="M1.5 14.334L7.834 8 1.5 1.666"
        stroke="currentColor"
        strokeWidth={2.1112}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NextIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={NextIconSVG} {...props} />;
};
