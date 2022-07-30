import { forEach } from "lodash";
import React, { useEffect, useState } from "react";



export default function PaymentCard({cvv}){
    
    return(
        <svg width="313" height="187" viewBox="0 0 313 187" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7109_21593)">
<rect width="312" height="187" rx="15.65" fill="#FAFAFA"/>
<g clip-path="url(#clip1_7109_21593)">
<circle cx="312.51" cy="84.6087" r="117.864" transform="rotate(-90 312.51 84.6087)" fill="#DBEF06"/>
</g>
<g clip-path="url(#clip2_7109_21593)">
<circle cx="312.51" cy="-33.2555" r="117.864" transform="rotate(-90 312.51 -33.2555)" fill="#DBEF06"/>
</g>
<path d="M53.0331 145.513C54.3097 145.513 55.418 145.724 56.3579 146.144C57.3119 146.565 58.0413 147.167 58.5464 147.952C59.0514 148.737 59.3039 149.669 59.3039 150.748C59.3039 151.813 59.0514 152.745 58.5464 153.543C58.0413 154.328 57.3119 154.931 56.3579 155.351C55.418 155.772 54.3097 155.982 53.0331 155.982H49.7083V160.228H46.9727V145.513H53.0331ZM52.9068 153.67C54.0993 153.67 55.0041 153.417 55.6214 152.913C56.2387 152.408 56.5473 151.687 56.5473 150.748C56.5473 149.809 56.2387 149.087 55.6214 148.583C55.0041 148.078 54.0993 147.826 52.9068 147.826H49.7083V153.67H52.9068Z" fill="#292929"/>
<path d="M60.6283 149.003H63.2587V160.228H60.6283V149.003ZM61.9541 147.153C61.4771 147.153 61.0773 147.006 60.7546 146.712C60.4319 146.403 60.2706 146.025 60.2706 145.577C60.2706 145.128 60.4319 144.757 60.7546 144.462C61.0773 144.154 61.4771 144 61.9541 144C62.431 144 62.8309 144.147 63.1535 144.441C63.4762 144.722 63.6375 145.079 63.6375 145.513C63.6375 145.976 63.4762 146.368 63.1535 146.691C62.8449 146.999 62.4451 147.153 61.9541 147.153Z" fill="#292929"/>
<path d="M70.2464 155.414L68.2894 157.264V160.228H65.659V144.631H68.2894V154.048L73.7395 149.003H76.896L72.2034 153.712L77.3379 160.228H74.1394L70.2464 155.414Z" fill="#292929"/>
<path d="M82.5722 155.414L80.6152 157.264V160.228H77.9848V144.631H80.6152V154.048L86.0654 149.003H89.2219L84.5292 153.712L89.6638 160.228H86.4652L82.5722 155.414Z" fill="#292929"/>
<path d="M100.984 149.003V158.525C100.984 162.477 99.0415 164.453 95.1555 164.453C94.1314 164.453 93.1494 164.313 92.2095 164.033C91.2836 163.766 90.519 163.374 89.9158 162.856L91.0942 160.88C91.5712 161.286 92.1534 161.608 92.8408 161.847C93.5282 162.085 94.2507 162.204 95.0082 162.204C96.1586 162.204 97.0003 161.924 97.5334 161.363C98.0805 160.817 98.3541 159.969 98.3541 158.82V158.294C97.9332 158.757 97.4212 159.114 96.8179 159.366C96.2147 159.604 95.5624 159.723 94.8609 159.723C93.3598 159.723 92.1744 159.31 91.3046 158.483C90.4489 157.656 90.021 156.416 90.021 154.763V149.003H92.6514V154.426C92.6514 155.421 92.8759 156.171 93.3248 156.675C93.7877 157.166 94.4401 157.411 95.2818 157.411C96.2217 157.411 96.9652 157.124 97.5124 156.549C98.0735 155.975 98.3541 155.141 98.3541 154.048V149.003H100.984Z" fill="#292929"/>
<path d="M29.1199 151.966H23.7457C23.5549 151.966 23.4004 151.802 23.4004 151.6V145.906C23.4004 145.704 23.5549 145.54 23.7457 145.54H29.1199C29.3107 145.54 29.4652 145.704 29.4652 145.906V151.6C29.4652 151.802 29.3107 151.966 29.1199 151.966Z" fill="#DBEF06"/>
<path d="M44.2821 160.043H38.9078C38.717 160.043 38.5625 159.879 38.5625 159.676V145.907C38.5625 145.704 38.717 145.54 38.9078 145.54H44.2821C44.4728 145.54 44.6273 145.704 44.6273 145.907V159.676C44.6273 159.879 44.4728 160.043 44.2821 160.043Z" fill="#DBEF06"/>
<path d="M36.6562 160.044H23.7445C23.5544 160.044 23.4004 159.88 23.4004 159.678V153.984C23.4004 153.782 23.5544 153.618 23.7445 153.618H36.6562C36.8463 153.618 37.0003 153.782 37.0003 153.984V159.678C37.0003 159.88 36.8463 160.044 36.6562 160.044Z" fill="#DBEF06"/>
<path d="M33.9682 152.057C32.1921 152.057 30.752 150.598 30.752 148.799C30.752 146.999 32.1921 145.54 33.9682 145.54C35.7443 145.54 37.1844 146.999 37.1844 148.799C37.1844 150.598 35.7443 152.057 33.9682 152.057Z" fill="#DBEF06"/>
</g>
<rect x="25" y="85" width="261" height="28.0823" rx="3.3038" fill="#F2F2F2"/>
<rect x="25" y="109.779" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="106.475" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="103.17" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="99.8672" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="96.5625" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="93.2598" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="89.9551" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<rect x="25" y="86.6523" width="204.835" height="1.6519" fill="#DBEF06" fill-opacity="0.25"/>
<text x="245" y="105" fill="#292929" className="check">{cvv}</text>
<rect y="26" width="313" height="48" fill="#2E2E2E"/>
<defs>
<clipPath id="clip0_7109_21593">
<rect width="312" height="187" rx="15.65" fill="white"/>
</clipPath>
<clipPath id="clip1_7109_21593">
<rect width="117.864" height="235.728" fill="white" transform="translate(194.646 202.473) rotate(-90)"/>
</clipPath>
<clipPath id="clip2_7109_21593">
<rect width="117.864" height="235.728" fill="white" transform="translate(194.646 84.6084) rotate(-90)"/>
</clipPath>
</defs>
</svg>
        
    )
} 

