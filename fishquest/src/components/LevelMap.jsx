import MapLevels from "../assets/Map.svg?react";
import { Link } from "react-router-dom";
import "../styles/LevelMap.css";
export default function LevelMap(props) {
  return (
    <>
      <div className="levelBackground d-flex flex-column gap-5 align-items-center">
        <div style={{ width: "100%", maxWidth: "800px", padding: "2rem 1rem" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 442 569"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            {...props}
          >
            <g id="Map">
              <g id="Dashes">
                <path
                  id="dash"
                  d="M226 127.5C240.737 157.637 216.119 192.673 132.243 194M221.5 334C232.869 363.169 209.719 409.961 132.243 395.363M357 456C357 456 377.836 536.569 291.602 537.232"
                  stroke="#D9D9D9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                />
                <path
                  id="dash_2"
                  d="M58.5 226.5C51.5511 252.531 86.533 298.725 154.944 298.393"
                  stroke="#D9D9D9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                />
                <path
                  id="dash_3"
                  d="M54.5 439C38.3723 477.511 66.7132 546.651 150.858 540.357"
                  stroke="#D9D9D9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                />
                <path
                  id="dash_4"
                  d="M384.842 265.357C389.758 285.896 396.97 325.718 288.424 301.071"
                  stroke="#D9D9D9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                />
              </g>
              <Link to="/level">
                <g id="TextBubble7">
                  <path
                    id="Union"
                    d="M268 447C276.284 447 283 453.716 283 462V469.244C283 477.528 276.284 484.244 268 484.244H229.537L223.954 497.87L218.371 484.244H179C170.716 484.244 164 477.528 164 469.244V462C164 453.716 170.716 447 179 447H268Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="194" y="462.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="197" y="476.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble6">
                  <path
                    id="Union_2"
                    d="M401 333C409.284 333 416 339.716 416 348V355.244C416 363.528 409.284 370.244 401 370.244H362.537L356.954 383.87L351.371 370.244H312C303.716 370.244 297 363.528 297 355.244V348C297 339.716 303.716 333 312 333H401Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName_2"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="327" y="348.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_2"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="330" y="362.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble5">
                  <path
                    id="Union_3"
                    d="M105 311C113.284 311 120 317.716 120 326V333.244C120 341.528 113.284 348.244 105 348.244H66.5371L60.9541 361.87L55.3711 348.244H16C7.71573 348.244 1 341.528 1 333.244V326C1 317.716 7.71573 311 16 311H105Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName_3"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="31" y="326.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_3"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="34" y="340.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble4">
                  <path
                    id="Union_4"
                    d="M427 145C435.284 145 442 151.716 442 160V167.244C442 175.528 435.284 182.244 427 182.244H388.537L382.954 195.87L377.371 182.244H338C329.716 182.244 323 175.528 323 167.244V160C323 151.716 329.716 145 338 145H427Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName_4"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="353" y="160.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_4"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="356" y="174.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble3">
                  <path
                    id="Union_5"
                    d="M268 209C276.284 209 283 215.716 283 224V231.244C283 239.528 276.284 246.244 268 246.244H229.537L223.954 259.87L218.371 246.244H179C170.716 246.244 164 239.528 164 231.244V224C164 215.716 170.716 209 179 209H268Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName_5"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="194" y="224.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_5"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="197" y="238.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble2">
                  <path
                    id="Union_6"
                    d="M104 103C112.284 103 119 109.716 119 118V125.244C119 133.528 112.284 140.244 104 140.244H65.5371L59.9541 153.87L54.3711 140.244H15C6.71573 140.244 0 133.528 0 125.244V118C0 109.716 6.71573 103 15 103H104Z"
                    fill="#FFEF2D"
                  />
                  <text
                    id="LevelName_6"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="30" y="118.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_6"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="33" y="132.012">
                      1/5 Challenges
                    </tspan>
                  </text>
                </g>
              </Link>
              <Link to="/level">
                <g id="TextBubble1">
                  <path
                    id="Union_7"
                    d="M268 0C276.284 0 283 6.71573 283 15V22.2441C283 30.5284 276.284 37.2441 268 37.2441H229.537L223.954 50.8701L218.371 37.2441H179C170.716 37.2441 164 30.5284 164 22.2441V15C164 6.71573 170.716 4.75144e-07 179 0H268Z"
                    fill="#00B3FF"
                  />
                  <text
                    id="LevelName_7"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Jua"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="194" y="15.1">
                      Level Name
                    </tspan>
                  </text>
                  <text
                    id="ChallengeProgress_7"
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Dongle"
                    fontSize="12"
                    letterSpacing="0em"
                  >
                    <tspan x="203" y="29.012">
                      COMPLETED
                    </tspan>
                  </text>
                </g>
              </Link>
              {/* --- Ponds (unchanged except JSX attribute casing) --- */}
              <g id="PondBubble7">
                <g id="PondOval" filter="url(#filter0_d_2023_87)">
                  <ellipse
                    cx="222.568"
                    cy="537.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M222.567 515C238.647 515 253.159 517.585 263.613 521.729C268.843 523.802 273.008 526.246 275.849 528.908C278.688 531.569 280.136 534.376 280.136 537.214C280.136 540.052 278.688 542.86 275.849 545.521C273.008 548.183 268.843 550.626 263.613 552.699C253.159 556.843 238.647 559.429 222.567 559.429C206.488 559.429 191.977 556.843 181.522 552.699C176.292 550.626 172.127 548.183 169.286 545.521C166.447 542.86 165 540.052 165 537.214C165 534.376 166.447 531.569 169.286 528.908C172.127 526.246 176.292 523.802 181.522 521.729C191.977 517.585 206.488 515 222.567 515Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves"
                  d="M188.568 523.429C191.234 522.429 198.168 520.329 204.568 519.929M185.568 547.929C195.068 551.262 220.668 556.529 247.068 550.929M259.068 544.429C262.568 543.762 269.968 540.829 271.568 534.429M211.568 518.929C212.401 518.595 214.668 518.029 217.068 518.429M177.068 539.929C175.234 538.762 172.468 535.729 176.068 532.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              <g id="PondBubble6">
                <g id="PondOval_2" filter="url(#filter1_d_2023_87)">
                  <ellipse
                    cx="356.568"
                    cy="416.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M356.567 394C372.647 394 387.159 396.585 397.613 400.729C402.843 402.802 407.008 405.246 409.849 407.908C412.688 410.569 414.136 413.376 414.136 416.214C414.136 419.052 412.688 421.86 409.849 424.521C407.008 427.183 402.843 429.626 397.613 431.699C387.159 435.843 372.647 438.429 356.567 438.429C340.488 438.429 325.977 435.843 315.522 431.699C310.292 429.626 306.127 427.183 303.286 424.521C300.447 421.86 299 419.052 299 416.214C299 413.376 300.447 410.569 303.286 407.908C306.127 405.246 310.292 402.802 315.522 400.729C325.977 396.585 340.488 394 356.567 394Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_2"
                  d="M322.568 402.429C325.234 401.429 332.168 399.329 338.568 398.929M319.568 426.929C329.068 430.262 354.668 435.529 381.068 429.929M393.068 423.429C396.568 422.762 403.968 419.829 405.568 413.429M345.568 397.929C346.401 397.595 348.668 397.029 351.068 397.429M311.068 418.929C309.234 417.762 306.468 414.729 310.068 411.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect
                  id="Lock"
                  x="344.217"
                  y="393"
                  width="63.5618"
                  height="60.7143"
                  fill="url(#pattern0_2023_87)"
                />
              </g>
              <g id="PondBubble5">
                <g id="PondOval_3" filter="url(#filter2_d_2023_87)">
                  <ellipse
                    cx="60.5677"
                    cy="395.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M60.5674 373C76.6467 373 91.1587 375.585 101.613 379.729C106.843 381.802 111.008 384.246 113.849 386.908C116.688 389.569 118.136 392.376 118.136 395.214C118.136 398.052 116.688 400.86 113.849 403.521C111.008 406.183 106.843 408.626 101.613 410.699C91.1587 414.843 76.6467 417.429 60.5674 417.429C44.4882 417.429 29.977 414.843 19.5225 410.699C14.2924 408.626 10.127 406.183 7.28613 403.521C4.44704 400.86 3 398.052 3 395.214C3.00014 392.376 4.44722 389.569 7.28613 386.908C10.1271 384.246 14.2923 381.802 19.5225 379.729C29.977 375.585 44.4882 373 60.5674 373Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_3"
                  d="M26.5677 381.429C29.2343 380.429 36.1677 378.329 42.5677 377.929M23.5677 405.929C33.0677 409.262 58.6677 414.529 85.0677 408.929M97.0677 402.429C100.568 401.762 107.968 398.829 109.568 392.429M49.5677 376.929C50.401 376.595 52.6677 376.029 55.0677 376.429M15.0677 397.929C13.2343 396.762 10.4677 393.729 14.0677 390.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              <g id="PondBubble4">
                <g id="PondOval_4" filter="url(#filter3_d_2023_87)">
                  <ellipse
                    cx="382.568"
                    cy="231.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M382.567 209C398.647 209 413.159 211.585 423.613 215.729C428.843 217.802 433.008 220.246 435.849 222.908C438.688 225.569 440.136 228.376 440.136 231.214C440.136 234.052 438.688 236.86 435.849 239.521C433.008 242.183 428.843 244.626 423.613 246.699C413.159 250.843 398.647 253.429 382.567 253.429C366.488 253.429 351.977 250.843 341.522 246.699C336.292 244.626 332.127 242.183 329.286 239.521C326.447 236.86 325 234.052 325 231.214C325 228.376 326.447 225.569 329.286 222.908C332.127 220.246 336.292 217.802 341.522 215.729C351.977 211.585 366.488 209 382.567 209Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_4"
                  d="M348.568 217.429C351.234 216.429 358.168 214.329 364.568 213.929M345.568 241.929C355.068 245.262 380.668 250.529 407.068 244.929M419.068 238.429C422.568 237.762 429.968 234.829 431.568 228.429M371.568 212.929C372.401 212.595 374.668 212.029 377.068 212.429M337.068 233.929C335.234 232.762 332.468 229.729 336.068 226.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect
                  id="Lock_2"
                  x="377.41"
                  y="198.393"
                  width="63.5618"
                  height="60.7143"
                  fill="url(#pattern1_2023_87)"
                />
              </g>

              <g id="PondBubble3">
                <g id="PondOval_5" filter="url(#filter4_d_2023_87)">
                  <ellipse
                    cx="223.568"
                    cy="295.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M223.567 273C239.647 273 254.159 275.585 264.613 279.729C269.843 281.802 274.008 284.246 276.849 286.908C279.688 289.569 281.136 292.376 281.136 295.214C281.136 298.052 279.688 300.86 276.849 303.521C274.008 306.183 269.843 308.626 264.613 310.699C254.159 314.843 239.647 317.429 223.567 317.429C207.488 317.429 192.977 314.843 182.522 310.699C177.292 308.626 173.127 306.183 170.286 303.521C167.447 300.86 166 298.052 166 295.214C166 292.376 167.447 289.569 170.286 286.908C173.127 284.246 177.292 281.802 182.522 279.729C192.977 275.585 207.488 273 223.567 273Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_5"
                  d="M189.568 281.429C192.234 280.429 199.168 278.329 205.568 277.929M186.568 305.929C196.068 309.262 221.668 314.529 248.068 308.929M260.068 302.429C263.568 301.762 270.968 298.829 272.568 292.429M212.568 276.929C213.401 276.595 215.668 276.029 218.068 276.429M178.068 297.929C176.234 296.762 173.468 293.729 177.068 290.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              <g id="PondBubble2">
                <g id="PondOval_6" filter="url(#filter5_d_2023_87)">
                  <ellipse
                    cx="60.5677"
                    cy="187.214"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M60.5674 165C76.6467 165 91.1587 167.585 101.613 171.729C106.843 173.802 111.008 176.246 113.849 178.908C116.688 181.569 118.136 184.376 118.136 187.214C118.136 190.052 116.688 192.86 113.849 195.521C111.008 198.183 106.843 200.626 101.613 202.699C91.1587 206.843 76.6467 209.429 60.5674 209.429C44.4882 209.429 29.977 206.843 19.5225 202.699C14.2924 200.626 10.127 198.183 7.28613 195.521C4.44704 192.86 3 190.052 3 187.214C3.00014 184.376 4.44722 181.569 7.28613 178.908C10.1271 176.246 14.2923 173.802 19.5225 171.729C29.977 167.585 44.4882 165 60.5674 165Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_6"
                  d="M26.5677 173.429C29.2343 172.429 36.1677 170.329 42.5677 169.929M23.5677 197.929C33.0677 201.262 58.6677 206.529 85.0677 200.929M97.0677 194.429C100.568 193.762 107.968 190.829 109.568 184.429M49.5677 168.929C50.401 168.595 52.6677 168.029 55.0677 168.429M15.0677 189.929C13.2343 188.762 10.4677 185.729 14.0677 182.929"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              <g id="PondBubble1">
                <g id="PondOval_7" filter="url(#filter6_d_2023_87)">
                  <ellipse
                    cx="223.5"
                    cy="86.7857"
                    rx="58.5677"
                    ry="23.2143"
                    fill="#00B3FF"
                  />
                  <path
                    d="M223.5 64.5714C239.579 64.5714 254.091 67.1561 264.546 71.2999C269.776 73.373 273.94 75.8174 276.781 78.4796C279.62 81.1402 281.068 83.9472 281.068 86.7853C281.068 89.6235 279.62 92.4312 276.781 95.0919C273.94 97.7541 269.775 100.198 264.546 102.271C254.091 106.414 239.579 109 223.5 109C207.42 109 192.909 106.414 182.455 102.271C177.225 100.198 173.059 97.7542 170.218 95.0919C167.379 92.4313 165.932 89.6234 165.932 86.7853C165.932 83.9473 167.38 81.1401 170.218 78.4796C173.059 75.8173 177.225 73.373 182.455 71.2999C192.909 67.1561 207.421 64.5714 223.5 64.5714Z"
                    stroke="#005173"
                    strokeWidth="2"
                  />
                </g>
                <path
                  id="WaterWaves_7"
                  d="M189.5 73C192.167 72 199.1 69.9 205.5 69.5M186.5 97.5C196 100.833 221.6 106.1 248 100.5M260 94C263.5 93.3333 270.9 90.4 272.5 84M212.5 68.5C213.333 68.1667 215.6 67.6 218 68M178 89.5C176.167 88.3333 173.4 85.3 177 82.5"
                  stroke="white"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            </g>

            <defs>
              <filter
                id="filter0_d_2023_87"
                x="164"
                y="514"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>
              <filter
                id="filter2_d_2023_87"
                x="2"
                y="372"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>

              <filter
                id="filter3_d_2023_87"
                x="324"
                y="208"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>

              <filter
                id="filter4_d_2023_87"
                x="165"
                y="272"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>

              <filter
                id="filter5_d_2023_87"
                x="2"
                y="164"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>

              <filter
                id="filter6_d_2023_87"
                x="164.932"
                y="63.5714"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_2023_87"
                x="298"
                y="393"
                width="117.135"
                height="54.4286"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.317647 0 0 0 0 0.45098 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2023_87"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2023_87"
                  result="shape"
                />
              </filter>

              <pattern
                id="pattern0_2023_87"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_2023_87"
                  transform="matrix(0.00955201 0 0 0.01 0.0223997 0)"
                />
              </pattern>

              <pattern
                id="pattern1_2023_87"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_2023_87"
                  transform="matrix(0.00955201 0 0 0.01 0.0223997 0)"
                />
              </pattern>

              <image
                id="image0_2023_87"
                width="100"
                height="100"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>
        <div className="d-flex justify-content-center">
          <div className="iconCircle">
            <i className="bi bi-arrow-down"></i>
          </div>
        </div>
      </div>
    </>
  );
}
