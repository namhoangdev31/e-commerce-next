import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

export const CompanyIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M11.412 18.802H4.745c-1.667 0-2.5-.833-2.5-2.5V9.635c0-1.666.833-2.5 2.5-2.5H8.91v9.167c0 1.667.834 2.5 2.5 2.5zM9.003 3.802c-.067.25-.092.525-.092.833v2.5H4.745V5.47c0-.917.75-1.667 1.666-1.667h2.592zM12.245 7.135v4.167M15.578 7.135v4.167M14.745 14.635h-1.667a.836.836 0 00-.833.834v3.333h3.333V15.47a.836.836 0 00-.833-.834zM5.578 11.302v3.333"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.911 16.302V4.635c0-1.666.834-2.5 2.5-2.5h5c1.667 0 2.5.834 2.5 2.5v11.667c0 1.667-.833 2.5-2.5 2.5h-5c-1.666 0-2.5-.833-2.5-2.5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CompanyIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CompanyIconSVG} {...props} />;
};
