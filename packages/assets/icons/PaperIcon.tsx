import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const PaperIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
      <path
        d="M22.1 6v2.42c0 1.58-1 2.58-2.58 2.58H16.1V4.01c0-1.11.91-2.01 2.02-2.01 1.09.01 2.09.45 2.81 1.17.72.73 1.17 1.73 1.17 2.83z"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.1 7v14c0 .83.94 1.3 1.6.8l1.71-1.28c.4-.3.96-.26 1.32.1l1.66 1.67c.39.39 1.03.39 1.42 0l1.68-1.68c.35-.35.91-.39 1.3-.09l1.71 1.28c.66.49 1.6.02 1.6-.8V4c0-1.1.9-2 2-2h-12c-3 0-4 1.79-4 4v1z"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.4}
        d="M6.1 9h6M6.85 13h4.5"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const PaperIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={PaperIconSVG} {...props} />;
};
