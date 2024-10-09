import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const CollectionIconSVG = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.4}
        d="M15.5 2v7.86c0 .44-.52.66-.84.37l-2.32-2.14a.496.496 0 00-.68 0l-2.32 2.14c-.32.29-.84.07-.84-.37V2h7zM13.25 14h4.25M9 18h8.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CollectionIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CollectionIconSVG} {...props} />;
};
