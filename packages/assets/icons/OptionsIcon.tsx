import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const OptionsIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 25 25" fill="none">
      <path
        d="M12.5 22.5c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.497 12.5h.008M12.495 12.5h.01M8.495 12.5h.008"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const OptionsIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={OptionsIconSVG} {...props} />;
};
