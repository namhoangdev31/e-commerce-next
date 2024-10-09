import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const DownloadPDFSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
      <g
        opacity={0.4}
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.1 9V2l-2 2M12.1 2l2 2" />
      </g>
      <path
        opacity={0.4}
        d="M2.08 13h4.41c.38 0 .72.21.89.55l1.17 2.34A2 2 0 0010.34 17h3.53a2 2 0 001.79-1.11l1.17-2.34a1 1 0 01.89-.55h4.36"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.1 5.13c-3.54.52-5 2.6-5 6.87v3c0 5 2 7 7 7h6c5 0 7-2 7-7v-3c0-4.27-1.46-6.35-5-6.87"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const DownloadPDF = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={DownloadPDFSVG} {...props} />;
};
