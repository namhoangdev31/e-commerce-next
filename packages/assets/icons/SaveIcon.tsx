import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const SaveIconSVG = () => {
  return (
    <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.625 21h-14a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.625 21v-8h-10v8M7.625 3v5h8"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SaveIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={SaveIconSVG} {...props} />;
};
