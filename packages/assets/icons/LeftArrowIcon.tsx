import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const LeftArrowIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={6} height={11} viewBox="0 0 6 11" fill="none">
      <path
        d="M5.442 1.95a.659.659 0 10-.931-.932L.558 4.972a.659.659 0 000 .931L4.51 9.856a.659.659 0 10.931-.931L1.955 5.437 5.442 1.95z"
        fill="#202020"
      />
    </svg>
  );
};

export const LeftArrowIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={LeftArrowIconSVG} {...props} />;
};
