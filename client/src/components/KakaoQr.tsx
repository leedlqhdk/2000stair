// 카카오톡 채널 상담창(https://pf.kakao.com/_IiNfn/chat)을 여는 QR 코드.
// PC에서 보는 분이 휴대폰 카메라로 찍으면 로그인 없이 바로 카톡 상담으로 이어진다.
// 29×29 모듈을 가로줄(path)로 그린 것이라 글자색(currentColor)을 따라간다. 주변 여백(quiet zone)은 감싸는 요소에서 둔다.
const QR_PATH =
  "M0 0.5h7m1 0h2m1 0h1m5 0h3m2 0h7m-29 1h1m5 0h1m2 0h1m1 0h2m2 0h3m4 0h1m5 0h1m-29 1h1m1 0h3m1 0h1m2 0h1m4 0h2m2 0h3m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m2 0h2m2 0h2m1 0h2m1 0h1m2 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h4m1 0h1m3 0h3m2 0h1m1 0h3m1 0h1m-29 1h1m5 0h1m1 0h1m1 0h1m3 0h4m4 0h1m5 0h1m-29 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-20 1h1m3 0h1m1 0h2m2 0h2m-20 1h7m1 0h1m1 0h5m1 0h1m5 0h2m3 0h1m-29 1h1m1 0h4m3 0h1m2 0h4m1 0h5m1 0h2m3 0h1m-29 1h1m5 0h1m1 0h4m1 0h6m2 0h3m1 0h2m-27 1h2m6 0h2m1 0h6m2 0h5m1 0h1m1 0h1m-28 1h2m2 0h1m1 0h3m1 0h2m3 0h1m1 0h1m3 0h1m1 0h1m2 0h3m-27 1h2m1 0h1m2 0h1m4 0h3m2 0h5m1 0h2m1 0h2m-28 1h1m3 0h2m1 0h3m1 0h2m1 0h1m1 0h2m2 0h3m-22 1h2m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m9 0h2m1 0h2m-28 1h1m4 0h2m1 0h5m3 0h1m5 0h4m1 0h1m-29 1h1m1 0h1m1 0h1m2 0h3m1 0h2m1 0h2m2 0h11m-29 1h1m3 0h1m1 0h1m1 0h1m1 0h3m1 0h2m2 0h1m3 0h2m1 0h2m-27 1h1m1 0h4m2 0h1m1 0h1m1 0h1m1 0h3m2 0h2m1 0h2m1 0h1m1 0h1m-28 1h1m1 0h1m3 0h2m1 0h1m1 0h3m1 0h1m1 0h1m1 0h6m1 0h2m-20 1h2m1 0h4m1 0h5m3 0h2m1 0h2m-29 1h7m1 0h2m1 0h3m1 0h2m1 0h3m1 0h1m1 0h1m2 0h1m-28 1h1m5 0h1m1 0h3m2 0h1m1 0h1m2 0h3m3 0h2m2 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m4 0h5m2 0h7m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h3m1 0h1m3 0h6m1 0h1m1 0h4m-29 1h1m1 0h3m1 0h1m1 0h1m5 0h12m1 0h1m-28 1h1m5 0h1m1 0h1m1 0h2m1 0h1m1 0h1m5 0h2m1 0h1m2 0h1m-28 1h7m2 0h1m1 0h5m1 0h1m1 0h1m4 0h1m1 0h1";

type KakaoQrProps = {
  className?: string;
};

export default function KakaoQr({ className = "" }: KakaoQrProps) {
  return (
    <svg
      viewBox="0 0 29 29"
      role="img"
      aria-label="카카오톡 상담창을 여는 QR 코드"
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={QR_PATH} fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
