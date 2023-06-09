import { render } from 'preact-render-to-string';

export function body() {
  return render(
    <>
      <div>Another deployed thing!!</div>
      <img src="/nausicaa.png" />
      <div id="root"></div>
    </>,
  );
}
