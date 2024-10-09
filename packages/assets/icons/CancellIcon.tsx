import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const CancelIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
      <path
        d="M12.834 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zM15.834 9l-6 6M9.834 9l6 6"
        stroke="#5B8DEF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CancelIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CancelIconSVG} {...props} />;
};
