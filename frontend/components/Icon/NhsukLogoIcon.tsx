import React from "react";

import Link from "next/link";

interface Props {
  className?: string;
}

const NhsukLogoIcon = ({ className }: Props) => (
  <Link href="https://www.nhs.uk" passHref>
    <a href="https://www.nhs.uk" className="nhsuk-header__link">
      <div
        className={`icon-wrapper nhsuk-logo-icon-wrapper nhsuk-header__logo ${
          className || ""
        }`}
      >
        <svg
          className="nhsuk-logo"
          width="99"
          height="40"
          viewBox="0 0 99 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="99" height="40" fill="transparent" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M84.9142 9.56844C88.0571 9.56844 90.2896 10.2515 91.9298 11.0247L93.9829 4.68519C91.8403 3.6851 88.1523 3.27167 84.2317 3.27167C77.2576 3.27167 70.0563 5.73379 70.0563 13.9482C70.0563 19.068 74.0689 20.6465 77.5196 22.004C80.1226 23.0279 82.4058 23.9261 82.4058 26.1237C82.4058 29.4069 78.2631 29.9104 75.6175 29.9104C72.8398 29.9104 69.4638 29.1794 67.7816 28.0829L65.7763 34.5598C68.5535 35.4288 72.3367 36.2077 75.6175 36.2077C82.9983 36.2077 91.1579 33.9246 91.1579 25.123C91.1579 19.3771 86.7982 17.6396 83.2595 16.2293C80.8424 15.266 78.8083 14.4553 78.8083 12.6241C78.8083 10.0662 81.5439 9.56844 84.9142 9.56844ZM9.54762 3.81675H20.1613L26.6802 25.8962H26.7702L31.2359 3.81675H39.2571L32.5166 35.6563H21.9393L15.2889 13.6248H15.1989L10.7747 35.6563H2.75354L9.54762 3.81675ZM42.4 3.81675H50.9184L48.4158 15.9974H58.4849L60.9933 3.81675H69.5117L62.9028 35.6563H54.3844L57.21 22.0194H47.1351L44.3095 35.6563H35.7911L42.4 3.81675Z"
            fill="#005EB8"
          />
        </svg>
      </div>
    </a>
  </Link>
);

export default NhsukLogoIcon;
