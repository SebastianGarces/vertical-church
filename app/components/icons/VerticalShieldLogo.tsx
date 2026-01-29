interface VerticalShieldLogoProps {
  className?: string;
  color?: string;
}

export function VerticalShieldLogo({
  className = "",
  color = "currentColor",
}: VerticalShieldLogoProps) {
  return (
    <svg
      width="445"
      height="554"
      viewBox="0 0 445 554"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_shield)">
        <path
          d="M222.23 0C99.69 0 0 99.69 0 222.23V553.07H444.46V222.23C444.46 99.69 344.77 0 222.23 0ZM423.01 222.23V266.77L227.19 21.51C335.62 24.16 423 113.18 423 222.23H423.01ZM21.45 301.16L222.97 50.6L423.01 301.15V444.52L223.03 194.05L21.45 444.68V301.16ZM218.86 21.49L21.45 266.94V222.23C21.45 112.65 109.7 23.3 218.86 21.49ZM122 531.62L222.97 406.08L323.21 531.62H122ZM350.65 531.62L223.03 371.78L94.47 531.62H21.45V478.9L222.97 228.33L423.01 478.88V531.62H350.65Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_shield">
          <rect width="444.46" height="553.07" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
