import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const SendIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 25 25" fill="none">
      <path
        d="M2.5 9c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5h-10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 9.5L14.37 12c-1.03.82-2.72.82-3.75 0L7.5 9.5M2.5 17h6M2.5 13h3"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SendIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={SendIconSVG} {...props} />;
};
