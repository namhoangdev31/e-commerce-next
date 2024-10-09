import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const LoanIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} viewBox="0 0 21 21" fill="none">
      <path
        d="M18.911 5.797v2.017c0 1.316-.833 2.15-2.15 2.15h-2.85V4.139c0-.925.758-1.675 1.684-1.675a3.35 3.35 0 012.341.975c.6.608.975 1.441.975 2.358z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.245 6.63v11.667a.83.83 0 001.333.667l1.425-1.067a.84.84 0 011.1.083l1.384 1.392a.84.84 0 001.183 0l1.4-1.4a.826.826 0 011.083-.075l1.425 1.067a.835.835 0 001.334-.667V4.13c0-.916.75-1.666 1.666-1.666h-10c-2.5 0-3.333 1.491-3.333 3.333v.833z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.4}
        d="M8.078 11.638h2.5M8.078 8.305h2.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.4}
        d="M5.574 11.63h.008M5.574 8.297h.008"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const LoanIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={LoanIconSVG} {...props} />;
};
