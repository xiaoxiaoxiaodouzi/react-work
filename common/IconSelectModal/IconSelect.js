import React from 'react'
import './index.css'

// eslint-disable-next-line

class IconSelect extends React.Component {
  componentDidMount() {
    let th = this;
    var ul = document.getElementsByClassName('anticons-list');
    //var li=ul[0].getElementsByTagName('li')
    for (var j = 0; j < ul.length; j++) {
      //使用（IIFE）立即执行函数给每一个li都添加上click事件
      //也可以用ul[Counts].childNods来获取里面的li
      (function (counts) {
        var li = ul[counts].getElementsByTagName('li');
        for (var i = 0; i < li.length; i++) {
          // eslint-disable-next-line
          (function (Index) {
            li[i].onclick = (e => th.props.selectIcon(li[Index].getElementsByClassName('ant-badge')[0].textContent))
          }(i))
        }
      }(j))
    }
  }
  render() {
    return (
      <div>
        <h3>方向性图标</h3>
          <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-step-backward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="step-backward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M759.3 76.3L327.9 431.6V132c0-19.9-16.1-36-36-36s-36 16.1-36 36v760c0 19.9 16.1 36 36 36s36-16.1 36-36V590.6l431.3 357.2c27.4 24.4 70.8 5 70.8-31.7V107.9c0-36.6-43.4-56.1-70.7-31.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">step-backward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-step-forward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="step-forward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M326.6 76.3L758 431.6V132c0-19.9 16.1-36 36-36s36 16.1 36 36v760c0 19.9-16.1 36-36 36s-36-16.1-36-36V590.6L326.7 947.8c-27.4 24.4-70.8 5-70.8-31.7V107.9c0-36.6 43.4-56.1 70.7-31.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">step-forward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fast-backward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="fast-backward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M524.6 481.6l436.2-375.4c24.4-22.8 63.1-4.7 63.1 29.5v752.7c0 34.2-38.7 52.3-63.1 29.5L524.6 540.6a40.84 40.84 0 0 1-12.7-29.5c.1-10.9 4.3-21.7 12.7-29.5z"></path>
                  <path d="M36 96c19.9 0 36 16.1 36 36v298.5l376.9-324.4c24.4-22.8 63.1-4.7 63.1 29.5v752.7c0 34.2-38.7 52.3-63.1 29.5L72 591.9V892c0 19.9-16.1 36-36 36S0 911.9 0 892V132c0-19.9 16.1-36 36-36z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fast-backward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fast-forward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="fast-forward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M499.4 481.6L63.1 106.1C38.7 83.4 0 101.5 0 135.6v752.7c0 34.2 38.7 52.3 63.1 29.5l436.2-377.3c8.4-7.9 12.6-18.7 12.7-29.5 0-10.8-4.2-21.6-12.6-29.4zM988 96c-19.9 0-36 16.1-36 36v298.5L575.1 106.1c-24.4-22.8-63.1-4.7-63.1 29.5v752.7c0 34.2 38.7 52.3 63.1 29.5l376.9-326V892c0 19.9 16.1 36 36 36s36-16.1 36-36V132c0-19.9-16.1-36-36-36z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fast-forward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-shrink">
                <svg viewBox="64 64 896 896" class="" data-icon="shrink" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M881.7 187.4l-45.1-45.1a8.03 8.03 0 0 0-11.3 0L667.8 299.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L576.1 439c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 157.6-157.6c3-3 3-8.1-.1-11.2zM439 576.1l-189.2 23.5c-6.6.8-9.3 8.9-4.7 13.5l54.7 54.7-157.5 157.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l157.6-157.6 54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L447.9 585a7.9 7.9 0 0 0-8.9-8.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">shrink</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-arrows-alt">
                <svg viewBox="64 64 896 896" class="" data-icon="arrows-alt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M855 160.1l-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L863.9 169a7.9 7.9 0 0 0-8.9-8.9zM416.6 562.3a8.03 8.03 0 0 0-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">arrows-alt</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-down">
                <svg viewBox="64 64 896 896" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">down</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-up">
                <svg viewBox="64 64 896 896" class="" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">up</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-left">
                <svg viewBox="64 64 896 896" class="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-right">
                <svg viewBox="64 64 896 896" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-caret-up">
                <svg viewBox="0 0 1024 1024" class="" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M76.3 632.8l405.1-489.1a42.53 42.53 0 0 1 63.4 0l403.1 489.1c24.4 27.4 5 70.8-31.7 70.8H107.9c-36.6 0-56.1-43.4-31.6-70.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">caret-up</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-caret-down">
                <svg viewBox="0 0 1024 1024" class="" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M76.3 392.3l403.1 489.1a42.53 42.53 0 0 0 63.4 0l405.1-489.1c24.4-27.4 5-70.8-31.7-70.8H108.1c-36.8 0-56.3 43.4-31.8 70.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">caret-down</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-caret-left">
                <svg viewBox="0 0 1024 1024" class="" data-icon="caret-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M631.3 76.3l-489.2 403a42.53 42.53 0 0 0 0 63.4l489.1 405.1c27.4 24.4 70.8 5 70.8-31.7V107.9c0-36.6-43.4-56.1-70.7-31.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">caret-left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-caret-right">
                <svg viewBox="0 0 1024 1024" class="" data-icon="caret-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M392.7 76.3l489.1 403.1a42.53 42.53 0 0 1 0 63.4L392.7 947.7c-27.4 24.4-70.8 5-70.8-31.7V107.9c.1-36.6 43.4-56.1 70.8-31.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">caret-right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-up-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="up-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M518.5 360.3a7.95 7.95 0 0 0-12.9 0l-178 246c-3.8 5.3 0 12.7 6.5 12.7H381c10.2 0 19.9-4.9 25.9-13.2L512 460.4l105.2 145.4c6 8.3 15.6 13.2 25.9 13.2H690c6.5 0 10.3-7.4 6.5-12.7l-178-246z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">up-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-down-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="down-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M690 405h-46.9c-10.2 0-19.9 4.9-25.9 13.2L512 563.6 406.8 418.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246c3.2 4.4 9.7 4.4 12.9 0l178-246c3.9-5.3.1-12.7-6.4-12.7z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">down-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-left-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="left-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M603.3 327.5l-246 178a7.95 7.95 0 0 0 0 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">left-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-right-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="right-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M666.7 505.5l-246-178A8 8 0 0 0 408 334v46.9c0 10.2 4.9 19.9 13.2 25.9L566.6 512 421.2 617.2c-8.3 6-13.2 15.6-13.2 25.9V690c0 6.5 7.4 10.3 12.7 6.5l246-178c4.4-3.2 4.4-9.8 0-13z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">right-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-double-right">
                <svg viewBox="64 64 896 896" class="" data-icon="double-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 0 0 188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 0 0 492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">double-right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-double-left">
                <svg viewBox="64 64 896 896" class="" data-icon="double-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">double-left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-vertical-left">
                <svg viewBox="64 64 896 896" class="" data-icon="vertical-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M762 164h-64c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V172c0-4.4-3.6-8-8-8zm-508 0v72.4c0 9.5 4.2 18.4 11.4 24.5L564.6 512 265.4 763.1c-7.2 6.1-11.4 15-11.4 24.5V860c0 6.8 7.9 10.5 13.1 6.1L689 512 267.1 157.9A7.95 7.95 0 0 0 254 164z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">vertical-left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-vertical-right">
                <svg viewBox="64 64 896 896" class="" data-icon="vertical-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M326 164h-64c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V172c0-4.4-3.6-8-8-8zm444 72.4V164c0-6.8-7.9-10.5-13.1-6.1L335 512l421.9 354.1c5.2 4.4 13.1.7 13.1-6.1v-72.4c0-9.4-4.2-18.4-11.4-24.5L459.4 512l299.2-251.1c7.2-6.1 11.4-15.1 11.4-24.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">vertical-right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-forward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="forward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M575.1 106.1l436.2 375.4c16.9 15.7 16.9 43.3 0 59L575.1 917.9c-24.4 22.8-63.1 4.7-63.1-29.5V135.6c0-34.1 38.7-52.2 63.1-29.5zM63.1 106.1l436.2 375.4c8.4 7.9 12.6 18.7 12.6 29.5s-4.2 21.6-12.6 29.5L63.1 917.9C38.7 940.6 0 922.5 0 888.4V135.7c0-34.2 38.7-52.3 63.1-29.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">forward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-backward">
                <svg viewBox="0 0 1024 1024" class="" data-icon="backward" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M448.98 106.1L12.68 481.6c-16.9 15.7-16.9 43.3 0 59l436.2 377.3c24.4 22.8 63.1 4.7 63.1-29.5V135.6c.1-34.1-38.6-52.2-63-29.5zM960.98 106.1l-436.3 375.5c-8.4 7.9-12.6 18.7-12.6 29.5s4.2 21.6 12.6 29.5l436.2 377.3c24.4 22.8 63.1 4.7 63.1-29.5V135.6c.1-34.1-38.6-52.2-63-29.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">backward</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-rollback">
                <svg viewBox="64 64 896 896" class="" data-icon="rollback" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M793 242H366v-74c0-6.7-7.7-10.4-12.9-6.3l-142 112a8 8 0 0 0 0 12.6l142 112c5.2 4.1 12.9.4 12.9-6.3v-74h415v470H175c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-28.7 64-64V306c0-35.3-28.7-64-64-64z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">rollback</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-enter">
                <svg viewBox="64 64 896 896" class="" data-icon="enter" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 0 0 0 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">enter</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-retweet">
                <svg viewBox="0 0 1024 1024" class="" data-icon="retweet" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M365.6 317.3h349L595.5 436.5a35.91 35.91 0 0 0 0 50.9c7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5L825 308.9c6.8-6.8 10.5-15.9 10.5-25.5s-3.8-18.7-10.5-25.5L641.2 74.2a35.91 35.91 0 0 0-50.9 0 35.91 35.91 0 0 0 0 50.9l120.2 120.2H365.6c-79.8 0-154.8 31.1-211.2 87.5C98.1 389.2 67 464.2 67 544c0 19.9 16.1 36 36 36s36-16.1 36-36c0-60.5 23.6-117.5 66.4-160.3 42.8-42.8 99.7-66.4 160.2-66.4z"></path>
                  <path d="M923.1 441c-19.9 0-36 16.1-36 36 0 60.5-23.6 117.5-66.4 160.3a225.18 225.18 0 0 1-160.3 66.4h-349l119.2-119.2a35.91 35.91 0 0 0 0-50.9 35.91 35.91 0 0 0-50.9 0L201.2 712.1c-6.8 6.8-10.5 15.9-10.5 25.5s3.8 18.7 10.5 25.5l183.7 183.7c7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5a35.91 35.91 0 0 0 0-50.9L315.6 775.6h344.9c79.8 0 154.8-31.1 211.2-87.5 56.4-56.4 87.5-131.4 87.5-211.2a36.1 36.1 0 0 0-36.1-35.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">retweet</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-swap">
                <svg viewBox="64 64 896 896" class="" data-icon="swap" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">swap</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-swap-left">
                <svg viewBox="0 0 1024 1024" class="" data-icon="swap-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M163.9 575.6c-.3 0-.6 0-.9-.1-.4 0-.7-.1-1.1-.1-.2 0-.5-.1-.7-.1-.4-.1-.8-.1-1.1-.2-.2 0-.4-.1-.6-.1-.4-.1-.8-.2-1.1-.3-.2 0-.4-.1-.6-.1l-1.1-.3c-.2-.1-.4-.1-.6-.2l-1-.3c-.2-.1-.5-.2-.7-.2l-.9-.3c-.3-.1-.5-.2-.8-.3-.3-.1-.5-.2-.8-.3-.3-.1-.6-.3-.9-.4-.2-.1-.4-.2-.7-.3-.3-.2-.6-.3-.9-.5l-.6-.3c-.3-.2-.7-.4-1-.6-.2-.1-.3-.2-.5-.3-.3-.2-.7-.4-1-.6-.2-.1-.3-.2-.5-.3-.3-.2-.6-.4-.9-.7-.2-.1-.4-.3-.5-.4-.3-.2-.6-.4-.8-.7-.2-.2-.5-.4-.7-.6-.2-.2-.4-.4-.6-.5-.9-.8-1.7-1.6-2.5-2.5-.2-.2-.4-.4-.5-.6-.2-.2-.4-.5-.6-.7-.2-.3-.4-.6-.7-.8-.1-.2-.3-.4-.4-.5-.2-.3-.4-.6-.7-.9-.1-.2-.2-.3-.3-.5-.2-.3-.4-.7-.6-1-.1-.2-.2-.3-.3-.5-.2-.3-.4-.7-.6-1l-.3-.6c-.2-.3-.3-.6-.5-.9l-.3-.6c-.1-.3-.3-.6-.4-.9-.1-.3-.2-.5-.3-.8-.1-.3-.2-.5-.3-.8l-.3-.9c-.1-.2-.2-.5-.2-.7l-.3-1c-.1-.2-.1-.4-.2-.6l-.3-1.1c0-.2-.1-.4-.1-.6-.1-.4-.2-.8-.2-1.1 0-.2-.1-.4-.1-.6-.1-.4-.1-.8-.2-1.1 0-.2-.1-.5-.1-.7 0-.4-.1-.7-.1-1.1 0-.3 0-.6-.1-.9 0-.3 0-.6-.1-.8-.1-1.2-.1-2.4 0-3.6 0-.3 0-.6.1-.8 0-.3 0-.6.1-.9 0-.4.1-.7.1-1.1 0-.2.1-.5.1-.7.1-.4.1-.8.2-1.1 0-.2.1-.4.1-.6.1-.4.2-.8.2-1.1 0-.2.1-.4.1-.6l.3-1.1c.1-.2.1-.4.2-.6l.3-1c.1-.2.2-.5.2-.7l.3-.9c.1-.3.2-.5.3-.8.1-.3.2-.5.3-.8.1-.3.3-.6.4-.9l.3-.6c.2-.3.3-.6.5-.9l.3-.6c.2-.3.4-.7.6-1 .1-.2.2-.3.3-.5.2-.3.4-.7.6-1 .1-.2.2-.3.3-.5.2-.3.4-.6.7-.9.1-.2.3-.4.4-.5.2-.3.4-.6.7-.8.2-.2.4-.5.6-.7l.6-.6c.4-.4.8-.9 1.2-1.3L318.6 337a35.91 35.91 0 0 1 50.9 0 35.91 35.91 0 0 1 0 50.9l-116 116h544.1c19.9 0 36 16.1 36 36s-16.1 36-36 36H164.8c-.4-.2-.7-.3-.9-.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">swap-left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-swap-right">
                <svg viewBox="0 0 1024 1024" class="" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M830.1 575.6c.3 0 .6 0 .9-.1.4 0 .7-.1 1.1-.1.2 0 .5-.1.7-.1.4-.1.8-.1 1.1-.2.2 0 .4-.1.6-.1.4-.1.8-.2 1.1-.3.2 0 .4-.1.6-.1l1.1-.3c.2-.1.4-.1.6-.2l1-.3c.2-.1.5-.2.7-.2l.9-.3c.3-.1.5-.2.8-.3.3-.1.5-.2.8-.3.3-.1.6-.3.9-.4.2-.1.4-.2.7-.3.3-.2.6-.3.9-.5l.6-.3c.3-.2.7-.4 1-.6.2-.1.3-.2.5-.3.3-.2.7-.4 1-.6.2-.1.3-.2.5-.3.3-.2.6-.4.9-.7.2-.1.4-.3.5-.4.3-.2.6-.4.8-.7.2-.2.5-.4.7-.6.2-.2.4-.4.6-.5.9-.8 1.7-1.6 2.5-2.5.2-.2.4-.4.5-.6.2-.2.4-.5.6-.7.2-.3.4-.6.7-.8.1-.2.3-.4.4-.5.2-.3.4-.6.7-.9.1-.2.2-.3.3-.5.2-.3.4-.7.6-1 .1-.2.2-.3.3-.5.2-.3.4-.7.6-1l.3-.6c.2-.3.3-.6.5-.9l.3-.6c.1-.3.3-.6.4-.9.1-.3.2-.5.3-.8.1-.3.2-.5.3-.8l.3-.9c.1-.2.2-.5.2-.7l.3-1c.1-.2.1-.4.2-.6l.3-1.1c0-.2.1-.4.1-.6.1-.4.2-.8.2-1.1 0-.2.1-.4.1-.6.1-.4.1-.8.2-1.1 0-.2.1-.5.1-.7 0-.4.1-.7.1-1.1 0-.3 0-.6.1-.9 0-.3 0-.6.1-.8.1-1.2.1-2.4 0-3.6 0-.3 0-.6-.1-.8 0-.3 0-.6-.1-.9 0-.4-.1-.7-.1-1.1 0-.2-.1-.5-.1-.7-.1-.4-.1-.8-.2-1.1 0-.2-.1-.4-.1-.6-.1-.4-.2-.8-.2-1.1 0-.2-.1-.4-.1-.6l-.3-1.1c-.1-.2-.1-.4-.2-.6l-.3-1c-.1-.2-.2-.5-.2-.7l-.3-.9c-.1-.3-.2-.5-.3-.8-.1-.3-.2-.5-.3-.8-.1-.3-.3-.6-.4-.9l-.3-.6c-.2-.3-.3-.6-.5-.9l-.3-.6c-.2-.3-.4-.7-.6-1-.1-.2-.2-.3-.3-.5-.2-.3-.4-.7-.6-1-.1-.2-.2-.3-.3-.5-.2-.3-.4-.6-.7-.9-.1-.2-.3-.4-.4-.5-.2-.3-.4-.6-.7-.8-.2-.2-.4-.5-.6-.7l-.6-.6c-.4-.4-.8-.9-1.2-1.3L675.5 336.8a35.91 35.91 0 0 0-50.9 0 35.91 35.91 0 0 0 0 50.9l116 116H196.5c-19.9 0-36 16.1-36 36s16.1 36 36 36h632.8c.3 0 .6-.1.8-.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">swap-right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-arrow-up">
                <svg viewBox="64 64 896 896" class="" data-icon="arrow-up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M868 545.5L536.1 163a31.96 31.96 0 0 0-48.3 0L156 545.5a7.97 7.97 0 0 0 6 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">arrow-up</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-arrow-down">
                <svg viewBox="64 64 896 896" class="" data-icon="arrow-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0 0 48.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">arrow-down</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-arrow-left">
                <svg viewBox="64 64 896 896" class="" data-icon="arrow-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">arrow-left</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-arrow-right">
                <svg viewBox="64 64 896 896" class="" data-icon="arrow-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">arrow-right</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-play-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="play-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">play-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-up-square">
                <svg viewBox="64 64 896 896" class="" data-icon="up-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M334 624h46.9c10.2 0 19.9-4.9 25.9-13.2L512 465.4l105.2 145.4c6 8.3 15.6 13.2 25.9 13.2H690c6.5 0 10.3-7.4 6.5-12.7l-178-246a7.95 7.95 0 0 0-12.9 0l-178 246A7.96 7.96 0 0 0 334 624z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">up-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-down-square">
                <svg viewBox="64 64 896 896" class="" data-icon="down-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M505.5 658.7c3.2 4.4 9.7 4.4 12.9 0l178-246c3.8-5.3 0-12.7-6.5-12.7H643c-10.2 0-19.9 4.9-25.9 13.2L512 558.6 406.8 413.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">down-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-left-square">
                <svg viewBox="64 64 896 896" class="" data-icon="left-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M365.3 518.5l246 178c5.3 3.8 12.7 0 12.7-6.5v-46.9c0-10.2-4.9-19.9-13.2-25.9L465.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5l-246 178a8.05 8.05 0 0 0 0 13z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">left-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-right-square">
                <svg viewBox="64 64 896 896" class="" data-icon="right-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M412.7 696.5l246-178c4.4-3.2 4.4-9.7 0-12.9l-246-178c-5.3-3.8-12.7 0-12.7 6.5V381c0 10.2 4.9 19.9 13.2 25.9L558.6 512 413.2 617.2c-8.3 6-13.2 15.6-13.2 25.9V690c0 6.5 7.4 10.3 12.7 6.5z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">right-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-login">
                <svg viewBox="64 64 896 896" class="" data-icon="login" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">login</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-logout">
                <svg viewBox="64 64 896 896" class="" data-icon="logout" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">logout</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-menu-fold">
                <svg viewBox="64 64 896 896" class="" data-icon="menu-fold" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 0 0 0 13.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">menu-fold</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-menu-unfold">
                <svg viewBox="64 64 896 896" class="" data-icon="menu-unfold" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">menu-unfold</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-bottom">
                <svg viewBox="64 64 896 896" class="" data-icon="border-bottom" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 808H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-720-94h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-498h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0 332h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-166h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm166 166h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-332h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm332 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0 332h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm222-72h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-388 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm388-404h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-388 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm388 426h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-388 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm388-404h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-388 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-bottom
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-horizontal">
                <svg viewBox="64 64 896 896" class="" data-icon="border-horizontal" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M540 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-664 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm664 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-664 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm664 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-horizontal
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-inner">
                <svg viewBox="64 64 896 896" class="" data-icon="border-inner" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-inner
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-left">
                <svg viewBox="64 64 896 896" class="" data-icon="border-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M208 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-left
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-right">
                <svg viewBox="64 64 896 896" class="" data-icon="border-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-right
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-top">
                <svg viewBox="64 64 896 896" class="" data-icon="border-top" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 144H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332-498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-top
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border-verticle">
                <svg viewBox="64 64 896 896" class="" data-icon="border-verticle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 476H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm332 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM152 382h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm332 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM208 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border-verticle
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pic-center">
                <svg viewBox="64 64 896 896" class="" data-icon="pic-center" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M952 792H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-632H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM848 660c8.8 0 16-7.2 16-16V380c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h672zM232 436h560v152H232V436z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pic-center
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pic-left">
                <svg viewBox="64 64 896 896" class="" data-icon="pic-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M952 792H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-632H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM608 660c8.8 0 16-7.2 16-16V380c0-8.8-7.2-16-16-16H96c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h512zM152 436h400v152H152V436zm552 210c0 4.4 3.6 8 8 8h224c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H712c-4.4 0-8 3.6-8 8v56zm8-204h224c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H712c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pic-left
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pic-right">
                <svg viewBox="64 64 896 896" class="" data-icon="pic-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M952 792H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-632H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-24 500c8.8 0 16-7.2 16-16V380c0-8.8-7.2-16-16-16H416c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h512zM472 436h400v152H472V436zM80 646c0 4.4 3.6 8 8 8h224c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H88c-4.4 0-8 3.6-8 8v56zm8-204h224c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H88c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pic-right
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-radius-bottomleft">
                <svg viewBox="64 64 896 896" class="" data-icon="radius-bottomleft" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M712 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm2-696h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM136 374h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-174h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm752 624h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-348 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-230 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm230 624H358c-87.3 0-158-70.7-158-158V484c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v182c0 127 103 230 230 230h182c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">radius-bottomleft
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-radius-bottomright">
                <svg viewBox="64 64 896 896" class="" data-icon="radius-bottomright" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M368 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-58-624h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm578 102h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm292 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm174 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm230 276h-56c-4.4 0-8 3.6-8 8v182c0 87.3-70.7 158-158 158H484c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h182c127 0 230-103 230-230V484c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">radius-bottomright
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-radius-upleft">
                <svg viewBox="64 64 896 896" class="" data-icon="radius-upleft" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M656 200h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm58 624h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 650h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm696-696h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-348 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-174 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm174-696H358c-127 0-230 103-230 230v182c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V358c0-87.3 70.7-158 158-158h182c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">radius-upleft
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fullscreen">
                <svg viewBox="64 64 896 896" class="" data-icon="fullscreen" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M290 236.4l43.9-43.9a8.01 8.01 0 0 0-4.7-13.6L169 160c-5.1-.6-9.5 3.7-8.9 8.9L179 329.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zm352.7 187.3c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7a8.01 8.01 0 0 0 13.6-4.7L863.9 169c.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370a8.03 8.03 0 0 0 0 11.3l42.4 42.4zM845 694.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3a8.03 8.03 0 0 0-11.3 0l-42.4 42.3a8.03 8.03 0 0 0 0 11.3L734 787.6l-43.9 43.9a8.01 8.01 0 0 0 4.7 13.6L855 864c5.1.6 9.5-3.7 8.9-8.9L845 694.9zm-463.7-94.6a8.03 8.03 0 0 0-11.3 0L236.3 733.9l-43.7-43.7a8.01 8.01 0 0 0-13.6 4.7L160.1 855c-.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fullscreen
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fullscreen-exit">
                <svg viewBox="64 64 896 896" class="" data-icon="fullscreen-exit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M391 240.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3a8.03 8.03 0 0 0-11.3 0l-42.4 42.3a8.03 8.03 0 0 0 0 11.3L280 333.6l-43.9 43.9a8.01 8.01 0 0 0 4.7 13.6L401 410c5.1.6 9.5-3.7 8.9-8.9L391 240.9zm10.1 373.2L240.8 633c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824a8.03 8.03 0 0 0 0 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7A8.01 8.01 0 0 0 391 783l18.9-160.1c.6-5.1-3.7-9.4-8.8-8.8zm221.8-204.2L783.2 391c6.6-.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3a8.03 8.03 0 0 0-11.3 0L690.3 279.9l-43.7-43.7a8.01 8.01 0 0 0-13.6 4.7L614.1 401c-.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9a8.01 8.01 0 0 0-4.7-13.6L623 614c-5.1-.6-9.5 3.7-8.9 8.9L633 783.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fullscreen-exit
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>


        <h3>提示建议性图标</h3>
          <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-question">
                <svg viewBox="64 64 896 896" class="" data-icon="question" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M764 280.9c-14-30.6-33.9-58.1-59.3-81.6C653.1 151.4 584.6 125 512 125s-141.1 26.4-192.7 74.2c-25.4 23.6-45.3 51-59.3 81.7-14.6 32-22 65.9-22 100.9v27c0 6.2 5 11.2 11.2 11.2h54c6.2 0 11.2-5 11.2-11.2v-27c0-99.5 88.6-180.4 197.6-180.4s197.6 80.9 197.6 180.4c0 40.8-14.5 79.2-42 111.2-27.2 31.7-65.6 54.4-108.1 64-24.3 5.5-46.2 19.2-61.7 38.8a110.85 110.85 0 0 0-23.9 68.6v31.4c0 6.2 5 11.2 11.2 11.2h54c6.2 0 11.2-5 11.2-11.2v-31.4c0-15.7 10.9-29.5 26-32.9 58.4-13.2 111.4-44.7 149.3-88.7 19.1-22.3 34-47.1 44.3-74 10.7-27.9 16.1-57.2 16.1-87 0-35-7.4-69-22-100.9zM512 787c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56-25.1-56-56-56z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">question</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-question-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">question-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-plus">
                <svg viewBox="64 64 896 896" class="" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M848 474H550V152h-76v322H176c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h298v322h76V550h298c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">plus</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-plus-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="plus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">plus-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pause">
                <svg viewBox="64 64 896 896" class="" data-icon="pause" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M304 176h80v672h-80zm408 0h-64c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pause</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pause-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="pause-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pause-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-minus">
                <svg viewBox="64 64 896 896" class="" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">minus</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-minus-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="minus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">minus-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-plus-square">
                <svg viewBox="64 64 896 896" class="" data-icon="plus-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">plus-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-minus-square">
                <svg viewBox="64 64 896 896" class="" data-icon="minus-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">minus-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-info">
                <svg viewBox="64 64 896 896" class="" data-icon="info" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M448 224a64 64 0 1 0 128 0 64 64 0 1 0-128 0zm96 168h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V400c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">info</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-info-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">info-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-exclamation">
                <svg viewBox="64 64 896 896" class="" data-icon="exclamation" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M448 804a64 64 0 1 0 128 0 64 64 0 1 0-128 0zm32-168h64c4.4 0 8-3.6 8-8V164c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">exclamation</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-exclamation-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM488 576h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">exclamation-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-close">
                <svg viewBox="64 64 896 896" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">close</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-close-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
                  <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">close-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-close-square">
                <svg viewBox="64 64 896 896" class="" data-icon="close-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M354 671h58.9c4.7 0 9.2-2.1 12.3-5.7L512 561.8l86.8 103.5c3 3.6 7.5 5.7 12.3 5.7H670c6.8 0 10.5-7.9 6.1-13.1L553.8 512l122.4-145.9c4.4-5.2.7-13.1-6.1-13.1h-58.9c-4.7 0-9.2 2.1-12.3 5.7L512 462.2l-86.8-103.5c-3-3.6-7.5-5.7-12.3-5.7H354c-6.8 0-10.5 7.9-6.1 13.1L470.2 512 347.9 657.9A7.95 7.95 0 0 0 354 671z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">close-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-check">
                <svg viewBox="64 64 896 896" class="" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">check</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-check-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path>
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">check-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-check-square">
                <svg viewBox="64 64 896 896" class="" data-icon="check-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M433.1 657.7a31.8 31.8 0 0 0 51.7 0l210.6-292c3.8-5.3 0-12.7-6.5-12.7H642c-10.2 0-19.9 4.9-25.9 13.3L459 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H315c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8z"></path>
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">check-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-clock-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="clock-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">clock-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-warning">
                <svg viewBox="64 64 896 896" class="" data-icon="warning" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M464 720a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">warning</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-issues-close">
                <svg viewBox="64 64 896 896" class="" data-icon="issues-close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72-112c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48zm400-188h-59.3c-2.6 0-5 1.2-6.5 3.3L763.7 538.1l-49.9-68.8a7.92 7.92 0 0 0-6.5-3.3H648c-6.5 0-10.3 7.4-6.5 12.7l109.2 150.7a16.1 16.1 0 0 0 26 0l165.8-228.7c3.8-5.3 0-12.7-6.5-12.7zm-44 306h-64.2c-5.5 0-10.6 2.9-13.6 7.5a352.2 352.2 0 0 1-49.8 62.2A355.92 355.92 0 0 1 651.1 840a355 355 0 0 1-138.7 27.9c-48.1 0-94.8-9.4-138.7-27.9a355.92 355.92 0 0 1-113.3-76.3A353.06 353.06 0 0 1 184 650.5c-18.6-43.8-28-90.5-28-138.5s9.4-94.7 28-138.5c17.9-42.4 43.6-80.5 76.4-113.2 32.8-32.7 70.9-58.4 113.3-76.3a355 355 0 0 1 138.7-27.9c48.1 0 94.8 9.4 138.7 27.9 42.4 17.9 80.5 43.6 113.3 76.3 19 19 35.6 39.8 49.8 62.2 2.9 4.7 8.1 7.5 13.6 7.5H892c6 0 9.8-6.3 7.2-11.6C828.8 178.5 684.7 82 517.7 80 278.9 77.2 80.5 272.5 80 511.2 79.5 750.1 273.3 944 512.4 944c169.2 0 315.6-97 386.7-238.4A8 8 0 0 0 892 694z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">issues-close
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-stop">
                <svg viewBox="64 64 896 896" class="" data-icon="stop" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">stop
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>
        <h3>编辑类图标</h3>
          <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-edit">
                <svg viewBox="64 64 896 896" class="" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">edit</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-form">
                <svg viewBox="64 64 896 896" class="" data-icon="form" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path>
                  <path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 0 0-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">form</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-copy">
                <svg viewBox="64 64 896 896" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">copy</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-scissor">
                <svg viewBox="64 64 896 896" class="" data-icon="scissor" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M567.1 512l318.5-319.3c5-5 1.5-13.7-5.6-13.7h-90.5c-2.1 0-4.2.8-5.6 2.3l-273.3 274-90.2-90.5c12.5-22.1 19.7-47.6 19.7-74.8 0-83.9-68.1-152-152-152s-152 68.1-152 152 68.1 152 152 152c27.7 0 53.6-7.4 75.9-20.3l90 90.3-90.1 90.3A151.04 151.04 0 0 0 288 582c-83.9 0-152 68.1-152 152s68.1 152 152 152 152-68.1 152-152c0-27.2-7.2-52.7-19.7-74.8l90.2-90.5 273.3 274c1.5 1.5 3.5 2.3 5.6 2.3H880c7.1 0 10.7-8.6 5.6-13.7L567.1 512zM288 370c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm0 444c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">scissor
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-delete">
                <svg viewBox="64 64 896 896" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">delete</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-snippets">
                <svg viewBox="64 64 896 896" class="" data-icon="snippets" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 112H724V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H500V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H320c-17.7 0-32 14.3-32 32v120h-96c-17.7 0-32 14.3-32 32v632c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32v-96h96c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM664 888H232V336h218v174c0 22.1 17.9 40 40 40h174v338zm0-402H514V336h.2L664 485.8v.2zm128 274h-56V456L544 264H360v-80h68v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h152v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h68v576z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">snippets
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-diff">
                <svg viewBox="64 64 896 896" class="" data-icon="diff" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M476 399.1c0-3.9-3.1-7.1-7-7.1h-42c-3.8 0-7 3.2-7 7.1V484h-84.5c-4.1 0-7.5 3.1-7.5 7v42c0 3.8 3.4 7 7.5 7H420v84.9c0 3.9 3.2 7.1 7 7.1h42c3.9 0 7-3.2 7-7.1V540h84.5c4.1 0 7.5-3.2 7.5-7v-42c0-3.9-3.4-7-7.5-7H476v-84.9zM560.5 704h-225c-4.1 0-7.5 3.2-7.5 7v42c0 3.8 3.4 7 7.5 7h225c4.1 0 7.5-3.2 7.5-7v-42c0-3.8-3.4-7-7.5-7zm-7.1-502.6c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v704c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32V397.3c0-8.5-3.4-16.6-9.4-22.6L553.4 201.4zM664 888H232V264h282.2L664 413.8V888zm190.2-581.4L611.3 72.9c-6-5.7-13.9-8.9-22.2-8.9H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h277l219 210.6V824c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V329.6c0-8.7-3.5-17-9.8-23z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">diff
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-highlight">
                <svg viewBox="64 64 896 896" class="" data-icon="highlight" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M957.6 507.4L603.2 158.2a7.9 7.9 0 0 0-11.2 0L353.3 393.4a8.03 8.03 0 0 0-.1 11.3l.1.1 40 39.4-117.2 115.3a8.03 8.03 0 0 0-.1 11.3l.1.1 39.5 38.9-189.1 187H72.1c-4.4 0-8.1 3.6-8.1 8V860c0 4.4 3.6 8 8 8h344.9c2.1 0 4.1-.8 5.6-2.3l76.1-75.6 40.4 39.8a7.9 7.9 0 0 0 11.2 0l117.1-115.6 40.1 39.5a7.9 7.9 0 0 0 11.2 0l238.7-235.2c3.4-3 3.4-8 .3-11.2zM389.8 796.2H229.6l134.4-133 80.1 78.9-54.3 54.1zm154.8-62.1L373.2 565.2l68.6-67.6 171.4 168.9-68.6 67.6zM713.1 658L450.3 399.1 597.6 254l262.8 259-147.3 145z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">highlight
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-align-center">
                <svg viewBox="64 64 896 896" class="" data-icon="align-center" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">align-center
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-align-left">
                <svg viewBox="64 64 896 896" class="" data-icon="align-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M120 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0 424h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm784 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">align-left
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-align-right">
                <svg viewBox="64 64 896 896" class="" data-icon="align-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M904 158H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 424H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 212H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">align-right
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bg-colors">
                <svg viewBox="64 64 896 896" class="" data-icon="bg-colors" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 0 0-12.8 0l-48 48a9.11 9.11 0 0 0 0 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bg-colors
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bold">
                <svg viewBox="64 64 896 896" class="" data-icon="bold" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M697.8 481.4c33.6-35 54.2-82.3 54.2-134.3v-10.2C752 229.3 663.9 142 555.3 142H259.4c-15.1 0-27.4 12.3-27.4 27.4v679.1c0 16.3 13.2 29.5 29.5 29.5h318.7c117 0 211.8-94.2 211.8-210.5v-11c0-73-37.4-137.3-94.2-175.1zM328 238h224.7c57.1 0 103.3 44.4 103.3 99.3v9.5c0 54.8-46.3 99.3-103.3 99.3H328V238zm366.6 429.4c0 62.9-51.7 113.9-115.5 113.9H328V542.7h251.1c63.8 0 115.5 51 115.5 113.9v10.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bold
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-italic">
                <svg viewBox="64 64 896 896" class="" data-icon="italic" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M798 160H366c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h181.2l-156 544H229c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8H474.4l156-544H798c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">italic
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-underline">
                <svg viewBox="64 64 896 896" class="" data-icon="underline" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M824 804H200c-4.4 0-8 3.4-8 7.6v60.8c0 4.2 3.6 7.6 8 7.6h624c4.4 0 8-3.4 8-7.6v-60.8c0-4.2-3.6-7.6-8-7.6zm-312-76c69.4 0 134.6-27.1 183.8-76.2C745 602.7 772 537.4 772 468V156c0-6.6-5.4-12-12-12h-60c-6.6 0-12 5.4-12 12v312c0 97-79 176-176 176s-176-79-176-176V156c0-6.6-5.4-12-12-12h-60c-6.6 0-12 5.4-12 12v312c0 69.4 27.1 134.6 76.2 183.8C377.3 701 442.6 728 512 728z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">underline
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-strikethrough">
                <svg viewBox="64 64 896 896" class="" data-icon="strikethrough" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M952 474H569.9c-10-2-20.5-4-31.6-6-15.9-2.9-22.2-4.1-30.8-5.8-51.3-10-82.2-20-106.8-34.2-35.1-20.5-52.2-48.3-52.2-85.1 0-37 15.2-67.7 44-89 28.4-21 68.8-32.1 116.8-32.1 54.8 0 97.1 14.4 125.8 42.8 14.6 14.4 25.3 32.1 31.8 52.6 1.3 4.1 2.8 10 4.3 17.8.9 4.8 5.2 8.2 9.9 8.2h72.8c5.6 0 10.1-4.6 10.1-10.1v-1c-.7-6.8-1.3-12.1-2-16-7.3-43.5-28-81.7-59.7-110.3-44.4-40.5-109.7-61.8-188.7-61.8-72.3 0-137.4 18.1-183.3 50.9-25.6 18.4-45.4 41.2-58.6 67.7-13.5 27.1-20.3 58.4-20.3 92.9 0 29.5 5.7 54.5 17.3 76.5 8.3 15.7 19.6 29.5 34.1 42H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h433.2c2.1.4 3.9.8 5.9 1.2 30.9 6.2 49.5 10.4 66.6 15.2 23 6.5 40.6 13.3 55.2 21.5 35.8 20.2 53.3 49.2 53.3 89 0 35.3-15.5 66.8-43.6 88.8-30.5 23.9-75.6 36.4-130.5 36.4-43.7 0-80.7-8.5-110.2-25-29.1-16.3-49.1-39.8-59.7-69.5-.8-2.2-1.7-5.2-2.7-9-1.2-4.4-5.3-7.5-9.7-7.5h-79.7c-5.6 0-10.1 4.6-10.1 10.1v1c.2 2.3.4 4.2.6 5.7 6.5 48.8 30.3 88.8 70.7 118.8 47.1 34.8 113.4 53.2 191.8 53.2 84.2 0 154.8-19.8 204.2-57.3 25-18.9 44.2-42.2 57.1-69 13-27.1 19.7-57.9 19.7-91.5 0-31.8-5.8-58.4-17.8-81.4-5.8-11.2-13.1-21.5-21.8-30.8H952c4.4 0 8-3.6 8-8v-60a8 8 0 0 0-8-7.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">strikethrough
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-redo">
                <svg viewBox="64 64 896 896" class="" data-icon="redo" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 0 1-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 0 1-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 0 0-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">redo
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-undo">
                <svg viewBox="64 64 896 896" class="" data-icon="undo" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M511.4 124C290.5 124.3 112 303 112 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-.3 13 6.3 12.9l167-.8c5.2 0 9-4.9 7.7-9.9L369.8 727a8 8 0 0 0-14.1-3L315 776.1c-10.2-8-20-16.7-29.3-26a318.64 318.64 0 0 1-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 0 1-68.6 101.7c-7.5 7.5-15.3 14.5-23.4 21.2a7.93 7.93 0 0 0-1.2 11.1l39.4 50.5c2.8 3.5 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-221.1-179.4-400.2-400.6-399.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">undo
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-zoom-in">
                <svg viewBox="64 64 896 896" class="" data-icon="zoom-in" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">zoom-in
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-zoom-out">
                <svg viewBox="64 64 896 896" class="" data-icon="zoom-out" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">zoom-out
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-font-colors">
                <svg viewBox="64 64 896 896" class="" data-icon="font-colors" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-650.3-80h85c4.2 0 8-2.7 9.3-6.8l53.7-166h219.2l53.2 166c1.3 4 5 6.8 9.3 6.8h89.1c1.1 0 2.2-.2 3.2-.5a9.7 9.7 0 0 0 6-12.4L573.6 118.6a9.9 9.9 0 0 0-9.2-6.6H462.1c-4.2 0-7.9 2.6-9.2 6.6L244.5 723.1c-.4 1-.5 2.1-.5 3.2-.1 5.3 4.3 9.7 9.7 9.7zm255.9-516.1h4.1l83.8 263.8H424.9l84.7-263.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">font-colors
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-font-size">
                <svg viewBox="64 64 896 896" class="" data-icon="font-size" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M920 416H616c-4.4 0-8 3.6-8 8v112c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-56h60v320h-46c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h164c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8h-46V480h60v56c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V424c0-4.4-3.6-8-8-8zM656 296V168c0-4.4-3.6-8-8-8H104c-4.4 0-8 3.6-8 8v128c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-64h168v560h-92c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-92V232h168v64c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">font-size
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-line-height">
                <svg viewBox="64 64 896 896" class="" data-icon="line-height" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M648 160H104c-4.4 0-8 3.6-8 8v128c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-64h168v560h-92c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-92V232h168v64c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8zm272.8 546H856V318h64.8c6 0 9.4-7 5.7-11.7L825.7 178.7a7.14 7.14 0 0 0-11.3 0L713.6 306.3a7.23 7.23 0 0 0 5.7 11.7H784v388h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5a7.2 7.2 0 0 0-5.6-11.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">line-height
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-colum-height">
                <svg viewBox="64 64 896 896" class="" data-icon="colum-height" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M840 836H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm0-724H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM610.8 378c6 0 9.4-7 5.7-11.7L515.7 238.7a7.14 7.14 0 0 0-11.3 0L403.6 366.3a7.23 7.23 0 0 0 5.7 11.7H476v268h-62.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V378h62.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">colum-height
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dash">
                <svg viewBox="64 64 896 896" class="" data-icon="dash" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M112 476h160v72H112zm320 0h160v72H432zm320 0h160v72H752z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dash
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-small-dash">
                <svg viewBox="64 64 896 896" class="" data-icon="small-dash" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M112 476h72v72h-72zm182 0h72v72h-72zm364 0h72v72h-72zm182 0h72v72h-72zm-364 0h72v72h-72z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">small-dash
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-sort-ascending">
                <svg viewBox="64 64 896 896" class="" data-icon="sort-ascending" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M839.6 433.8L749 150.5a9.24 9.24 0 0 0-8.9-6.5h-77.4c-4.1 0-7.6 2.6-8.9 6.5l-91.3 283.3c-.3.9-.5 1.9-.5 2.9 0 5.1 4.2 9.3 9.3 9.3h56.4c4.2 0 7.8-2.8 9-6.8l17.5-61.6h89l17.3 61.5c1.1 4 4.8 6.8 9 6.8h61.2c1 0 1.9-.1 2.8-.4 2.4-.8 4.3-2.4 5.5-4.6 1.1-2.2 1.3-4.7.6-7.1zM663.3 325.5l32.8-116.9h6.3l32.1 116.9h-71.2zm143.5 492.9H677.2v-.4l132.6-188.9c1.1-1.6 1.7-3.4 1.7-5.4v-36.4c0-5.1-4.2-9.3-9.3-9.3h-204c-5.1 0-9.3 4.2-9.3 9.3v43c0 5.1 4.2 9.3 9.3 9.3h122.6v.4L587.7 828.9a9.35 9.35 0 0 0-1.7 5.4v36.4c0 5.1 4.2 9.3 9.3 9.3h211.4c5.1 0 9.3-4.2 9.3-9.3v-43a9.2 9.2 0 0 0-9.2-9.3zM416 702h-76V172c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v530h-76c-6.7 0-10.5 7.8-6.3 13l112 141.9a8 8 0 0 0 12.6 0l112-141.9c4.1-5.2.4-13-6.3-13z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">sort-ascending
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-sort-descending">
                <svg viewBox="64 64 896 896" class="" data-icon="sort-descending" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M839.6 433.8L749 150.5a9.24 9.24 0 0 0-8.9-6.5h-77.4c-4.1 0-7.6 2.6-8.9 6.5l-91.3 283.3c-.3.9-.5 1.9-.5 2.9 0 5.1 4.2 9.3 9.3 9.3h56.4c4.2 0 7.8-2.8 9-6.8l17.5-61.6h89l17.3 61.5c1.1 4 4.8 6.8 9 6.8h61.2c1 0 1.9-.1 2.8-.4 2.4-.8 4.3-2.4 5.5-4.6 1.1-2.2 1.3-4.7.6-7.1zM663.3 325.5l32.8-116.9h6.3l32.1 116.9h-71.2zm143.5 492.9H677.2v-.4l132.6-188.9c1.1-1.6 1.7-3.4 1.7-5.4v-36.4c0-5.1-4.2-9.3-9.3-9.3h-204c-5.1 0-9.3 4.2-9.3 9.3v43c0 5.1 4.2 9.3 9.3 9.3h122.6v.4L587.7 828.9a9.35 9.35 0 0 0-1.7 5.4v36.4c0 5.1 4.2 9.3 9.3 9.3h211.4c5.1 0 9.3-4.2 9.3-9.3v-43a9.2 9.2 0 0 0-9.2-9.3zM310.3 167.1a8 8 0 0 0-12.6 0L185.7 309c-4.2 5.3-.4 13 6.3 13h76v530c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V322h76c6.7 0 10.5-7.8 6.3-13l-112-141.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">sort-descending
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-drag">
                <svg viewBox="64 64 896 896" class="" data-icon="drag" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M909.3 506.3L781.7 405.6a7.23 7.23 0 0 0-11.7 5.7V476H548V254h64.8c6 0 9.4-7 5.7-11.7L517.7 114.7a7.14 7.14 0 0 0-11.3 0L405.6 242.3a7.23 7.23 0 0 0 5.7 11.7H476v222H254v-64.8c0-6-7-9.4-11.7-5.7L114.7 506.3a7.14 7.14 0 0 0 0 11.3l127.5 100.8c4.7 3.7 11.7.4 11.7-5.7V548h222v222h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V548h222v64.8c0 6 7 9.4 11.7 5.7l127.5-100.8a7.3 7.3 0 0 0 .1-11.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">drag
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-ordered-list">
                <svg viewBox="64 64 896 896" class="" data-icon="ordered-list" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M920 760H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-568H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM216 712H100c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h72.4v20.5h-35.7c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h35.7V838H100c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h116c2.2 0 4-1.8 4-4V716c0-2.2-1.8-4-4-4zM100 188h38v120c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V152c0-4.4-3.6-8-8-8h-78c-2.2 0-4 1.8-4 4v36c0 2.2 1.8 4 4 4zm116 240H100c-2.2 0-4 1.8-4 4v36c0 2.2 1.8 4 4 4h68.4l-70.3 77.7a8.3 8.3 0 0 0-2.1 5.4V592c0 2.2 1.8 4 4 4h116c2.2 0 4-1.8 4-4v-36c0-2.2-1.8-4-4-4h-68.4l70.3-77.7a8.3 8.3 0 0 0 2.1-5.4V432c0-2.2-1.8-4-4-4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">ordered-list
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-radius-setting">
                <svg viewBox="64 64 896 896" class="" data-icon="radius-setting" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M396 140h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-44 684h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm524-204h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 344h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 160h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm320 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm160 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm140-284c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V370c0-127-103-230-230-230H484c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h170c87.3 0 158 70.7 158 158v170zM236 96H92c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm-48 101.6c0 1.3-1.1 2.4-2.4 2.4h-43.2c-1.3 0-2.4-1.1-2.4-2.4v-43.2c0-1.3 1.1-2.4 2.4-2.4h43.2c1.3 0 2.4 1.1 2.4 2.4v43.2zM920 780H776c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V788c0-4.4-3.6-8-8-8zm-48 101.6c0 1.3-1.1 2.4-2.4 2.4h-43.2c-1.3 0-2.4-1.1-2.4-2.4v-43.2c0-1.3 1.1-2.4 2.4-2.4h43.2c1.3 0 2.4 1.1 2.4 2.4v43.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">radius-setting
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>

        <h3>数据类图标</h3>
          <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-area-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="area-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-616-64h536c4.4 0 8-3.6 8-8V284c0-7.2-8.7-10.7-13.7-5.7L592 488.6l-125.4-124a8.03 8.03 0 0 0-11.3 0l-189 189.6a7.87 7.87 0 0 0-2.3 5.6V720c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">area-chart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pie-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="pie-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M864 518H506V160c0-4.4-3.6-8-8-8h-26a398.46 398.46 0 0 0-282.8 117.1 398.19 398.19 0 0 0-85.7 127.1A397.61 397.61 0 0 0 72 552a398.46 398.46 0 0 0 117.1 282.8c36.7 36.7 79.5 65.6 127.1 85.7A397.61 397.61 0 0 0 472 952a398.46 398.46 0 0 0 282.8-117.1c36.7-36.7 65.6-79.5 85.7-127.1A397.61 397.61 0 0 0 872 552v-26c0-4.4-3.6-8-8-8zM705.7 787.8A331.59 331.59 0 0 1 470.4 884c-88.1-.4-170.9-34.9-233.2-97.2C174.5 724.1 140 640.7 140 552c0-88.7 34.5-172.1 97.2-234.8 54.6-54.6 124.9-87.9 200.8-95.5V586h364.3c-7.7 76.3-41.3 147-96.6 201.8zM952 462.4l-2.6-28.2c-8.5-92.1-49.4-179-115.2-244.6A399.4 399.4 0 0 0 589 74.6L560.7 72c-4.7-.4-8.7 3.2-8.7 7.9V464c0 4.4 3.6 8 8 8l384-1c4.7 0 8.4-4 8-8.6zm-332.2-58.2V147.6a332.24 332.24 0 0 1 166.4 89.8c45.7 45.6 77 103.6 90 166.1l-256.4.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pie-chart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bar-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="bar-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-600-80h56c4.4 0 8-3.6 8-8V560c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V384c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v320c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V462c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v242c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v400c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bar-chart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dot-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="dot-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM288 604a64 64 0 1 0 128 0 64 64 0 1 0-128 0zm118-224a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm158 228a96 96 0 1 0 192 0 96 96 0 1 0-192 0zm148-314a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dot-chart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-line-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="line-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 0L266.3 586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">line-chart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-radar-chart">
                <svg viewBox="64 64 896 896" class="" data-icon="radar-chart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M926.8 397.1l-396-288a31.81 31.81 0 0 0-37.6 0l-396 288a31.99 31.99 0 0 0-11.6 35.8l151.3 466a32 32 0 0 0 30.4 22.1h489.5c13.9 0 26.1-8.9 30.4-22.1l151.3-466c4.2-13.2-.5-27.6-11.7-35.8zM838.6 417l-98.5 32-200-144.7V199.9L838.6 417zM466 567.2l-89.1 122.3-55.2-169.2L466 567.2zm-116.3-96.8L484 373.3v140.8l-134.3-43.7zM512 599.2l93.9 128.9H418.1L512 599.2zm28.1-225.9l134.2 97.1L540.1 514V373.3zM558 567.2l144.3-46.9-55.2 169.2L558 567.2zm-74-367.3v104.4L283.9 449l-98.5-32L484 199.9zM169.3 470.8l86.5 28.1 80.4 246.4-53.8 73.9-113.1-348.4zM327.1 853l50.3-69h269.3l50.3 69H327.1zm414.5-33.8l-53.8-73.9 80.4-246.4 86.5-28.1-113.1 348.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">radar-chart
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-heat-map">
                <svg viewBox="64 64 896 896" class="" data-icon="heat-map" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-790.4-23.9L512 231.9 858.7 832H165.3zm319-474.1l-228 394c-12.3 21.3 3.1 48 27.7 48h455.8c24.7 0 40.1-26.7 27.7-48L539.7 358c-6.2-10.7-17-16-27.7-16-10.8 0-21.6 5.3-27.7 16zm214 386H325.7L512 422l186.3 322zm-214-194.1l-57 98.4C415 669.5 430.4 696 455 696h114c24.6 0 39.9-26.5 27.7-47.7l-57-98.4c-6.1-10.6-16.9-15.9-27.7-15.9s-21.5 5.3-27.7 15.9zm57.1 98.4h-58.7l29.4-50.7 29.3 50.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">heat-map
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fall">
                <svg viewBox="64 64 896 896" class="" data-icon="fall" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 0 0-11.3 0l-45 45.2a8.03 8.03 0 0 0 0 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 0 0 4.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fall
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-rise">
                <svg viewBox="64 64 896 896" class="" data-icon="rise" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 0 0 0 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0 0 13.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">rise
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-stock">
                <svg viewBox="64 64 896 896" class="" data-icon="stock" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M904 747H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM165.7 621.8l39.7 39.5c3.1 3.1 8.2 3.1 11.3 0l234.7-233.9 97.6 97.3a32.11 32.11 0 0 0 45.2 0l264.2-263.2c3.1-3.1 3.1-8.2 0-11.3l-39.7-39.6a8.03 8.03 0 0 0-11.3 0l-235.7 235-97.7-97.3a32.11 32.11 0 0 0-45.2 0L165.7 610.5a7.94 7.94 0 0 0 0 11.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">stock
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-box-plot">
                <svg viewBox="64 64 896 896" class="" data-icon="box-plot" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M952 224h-52c-4.4 0-8 3.6-8 8v248h-92V304c0-4.4-3.6-8-8-8H232c-4.4 0-8 3.6-8 8v176h-92V232c0-4.4-3.6-8-8-8H72c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V548h92v172c0 4.4 3.6 8 8 8h560c4.4 0 8-3.6 8-8V548h92v244c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V232c0-4.4-3.6-8-8-8zM296 368h88v288h-88V368zm432 288H448V368h280v288z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">box-plot
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fund">
                <svg viewBox="64 64 896 896" class="" data-icon="fund" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M926 164H94c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V196c0-17.7-14.3-32-32-32zm-40 632H134V236h752v560zm-658.9-82.3c3.1 3.1 8.2 3.1 11.3 0l172.5-172.5 114.4 114.5c3.1 3.1 8.2 3.1 11.3 0l297-297.2c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 0 0-11.3 0L531 565 416.6 450.5a8.03 8.03 0 0 0-11.3 0l-214.9 215a8.03 8.03 0 0 0 0 11.3l36.7 36.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fund
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-sliders">
                <svg viewBox="64 64 896 896" class="" data-icon="sliders" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M320 224h-66v-56c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v56h-66c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8h66v56c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8v-56h66c4.4 0 8-3.6 8-8V232c0-4.4-3.6-8-8-8zm-60 508h-80V292h80v440zm644-436h-66v-96c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v96h-66c-4.4 0-8 3.6-8 8v416c0 4.4 3.6 8 8 8h66v96c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8v-96h66c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8zm-60 364h-80V364h80v296zM612 404h-66V232c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v172h-66c-4.4 0-8 3.6-8 8v200c0 4.4 3.6 8 8 8h66v172c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V620h66c4.4 0 8-3.6 8-8V412c0-4.4-3.6-8-8-8zm-60 145a3 3 0 0 1-3 3h-74a3 3 0 0 1-3-3v-74a3 3 0 0 1 3-3h74a3 3 0 0 1 3 3v74z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">sliders
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>

        <h3>网站通用图标</h3>
         <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-lock">
                <svg viewBox="64 64 896 896" class="" data-icon="lock" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">lock</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-unlock">
                <svg viewBox="64 64 896 896" class="" data-icon="unlock" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zm-40 376H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">unlock</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bars">
                <svg viewBox="0 0 1024 1024" class="" data-icon="bars" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M123.80000000000001 256.8a63 63 0 1 0 126 0 63 63 0 1 0-126 0zM855.7 285.8H357.9c-19.9 0-36.1-16.2-36.1-36.1 0-19.9 16.2-36.1 36.1-36.1h497.9c19.9 0 36.1 16.2 36.1 36.1-.1 20-16.2 36.1-36.2 36.1zM123.80000000000001 512a63 63 0 1 0 126 0 63 63 0 1 0-126 0zM855.7 541.1H357.9c-19.9 0-36.1-16.2-36.1-36.1 0-19.9 16.2-36.1 36.1-36.1h497.9c19.9 0 36.1 16.2 36.1 36.1a36.23 36.23 0 0 1-36.2 36.1zM123.80000000000001 767.2a63 63 0 1 0 126 0 63 63 0 1 0-126 0zM855.7 796.3H357.9c-19.9 0-36.1-16.2-36.1-36.1 0-19.9 16.2-36.1 36.1-36.1h497.9c19.9 0 36.1 16.2 36.1 36.1-.1 20-16.2 36.1-36.2 36.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bars</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-book">
                <svg viewBox="64 64 896 896" class="" data-icon="book" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-260 72h96v209.9L621.5 312 572 347.4V136zm220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0 0 22.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">book</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-calendar">
                <svg viewBox="64 64 896 896" class="" data-icon="calendar" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">calendar</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-cloud">
                <svg viewBox="64 64 896 896" class="" data-icon="cloud" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3zm36.3 281a123.07 123.07 0 0 1-87.6 36.3H263.9c-33.1 0-64.2-12.9-87.6-36.3A123.3 123.3 0 0 1 140 612c0-28 9.1-54.3 26.2-76.3a125.7 125.7 0 0 1 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10c54.3 14.5 92.1 63.8 92.1 120 0 33.1-12.9 64.3-36.3 87.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">cloud</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-cloud-download">
                <svg viewBox="64 64 896 896" class="" data-icon="cloud-download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9z"></path>
                  <path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">cloud-download</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-code">
                <svg viewBox="64 64 896 896" class="" data-icon="code" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 0 0 308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 0 0-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">code</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-copy">
                <svg viewBox="64 64 896 896" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">copy</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-credit-card">
                <svg viewBox="64 64 896 896" class="" data-icon="credit-card" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-792 72h752v120H136V232zm752 560H136V440h752v352zm-237-64h165c4.4 0 8-3.6 8-8v-72c0-4.4-3.6-8-8-8H651c-4.4 0-8 3.6-8 8v72c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">credit-card</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-delete">
                <svg viewBox="64 64 896 896" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">delete</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-desktop">
                <svg viewBox="64 64 896 896" class="" data-icon="desktop" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 140H96c-17.7 0-32 14.3-32 32v496c0 17.7 14.3 32 32 32h380v112H304c-8.8 0-16 7.2-16 16v48c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-48c0-8.8-7.2-16-16-16H548V700h380c17.7 0 32-14.3 32-32V172c0-17.7-14.3-32-32-32zm-40 488H136V212h752v416z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">desktop</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-download">
                <svg viewBox="64 64 896 896" class="" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">download</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-ellipsis">
                <svg viewBox="64 64 896 896" class="" data-icon="ellipsis" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M176 511a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">ellipsis</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file">
                <svg viewBox="64 64 896 896" class="" data-icon="file" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-text">
                <svg viewBox="64 64 896 896" class="" data-icon="file-text" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-text</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-unknown">
                <svg viewBox="64 64 896 896" class="" data-icon="file-unknown" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.7L639.4 73.4c-6-6-14.2-9.4-22.7-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM402 549c0 5.4 4.4 9.5 9.8 9.5h32.4c5.4 0 9.8-4.2 9.8-9.4 0-28.2 25.8-51.6 58-51.6s58 23.4 58 51.5c0 25.3-21 47.2-49.3 50.9-19.3 2.8-34.5 20.3-34.7 40.1v32c0 5.5 4.5 10 10 10h32c5.5 0 10-4.5 10-10v-12.2c0-6 4-11.5 9.7-13.3 44.6-14.4 75-54 74.3-98.9-.8-55.5-49.2-100.8-108.5-101.6-61.4-.7-111.5 45.6-111.5 103zm78 195a32 32 0 1 0 64 0 32 32 0 1 0-64 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-unknown</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-pdf">
                <svg viewBox="64 64 896 896" class="" data-icon="file-pdf" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.6 0 30.1-12.8 33.3-20.5 5.6-13.5 2.9-30.5-6.2-39.6-13.2-13-45.3-16.4-95.3-10.2-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7 6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4-4.9-19.9-5.6-48.1-2.7-51.4.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2-21.6 4.9-41.3 13-58.9 20.2-4.2 1.7-8.3 3.4-12.3 5 13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6 40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-pdf</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-word">
                <svg viewBox="64 64 896 896" class="" data-icon="file-word" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM528.1 472h-32.2c-5.5 0-10.3 3.7-11.6 9.1L434.6 680l-46.1-198.7c-1.3-5.4-6.1-9.3-11.7-9.3h-35.4a12.02 12.02 0 0 0-11.6 15.1l74.2 276c1.4 5.2 6.2 8.9 11.6 8.9h32c5.4 0 10.2-3.6 11.6-8.9l52.8-197 52.8 197c1.4 5.2 6.2 8.9 11.6 8.9h31.8c5.4 0 10.2-3.6 11.6-8.9l74.4-276a12.04 12.04 0 0 0-11.6-15.1H647c-5.6 0-10.4 3.9-11.7 9.3l-45.8 199.1-49.8-199.3c-1.3-5.4-6.1-9.1-11.6-9.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-word</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-excel">
                <svg viewBox="64 64 896 896" class="" data-icon="file-excel" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM514.1 580.1l-61.8-102.4c-2.2-3.6-6.1-5.8-10.3-5.8h-38.4c-2.3 0-4.5.6-6.4 1.9-5.6 3.5-7.3 10.9-3.7 16.6l82.3 130.4-83.4 132.8a12.04 12.04 0 0 0 10.2 18.4h34.5c4.2 0 8-2.2 10.2-5.7L510 664.8l62.3 101.4c2.2 3.6 6.1 5.7 10.2 5.7H620c2.3 0 4.5-.7 6.5-1.9 5.6-3.6 7.2-11 3.6-16.6l-84-130.4 85.3-132.5a12.04 12.04 0 0 0-10.1-18.5h-35.7c-4.2 0-8.1 2.2-10.3 5.8l-61.2 102.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-excel</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-jpg">
                <svg viewBox="0 0 1024 1024" class="" data-icon="file-jpg" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M874.6 301.8L596.8 21.3c-4.5-4.5-9.4-8.3-14.7-11.5-1.4-.8-2.8-1.6-4.3-2.3-.9-.5-1.9-.9-2.8-1.3-9-4-18.9-6.2-29-6.2H201c-39.8 0-73 32.2-73 72v880c0 39.8 33.2 72 73 72h623c39.8 0 71-32.2 71-72V352.5c0-19-7-37.2-20.4-50.7zM583 110.4L783.8 312H583V110.4zM823 952H200V72h311v240c0 39.8 33.2 72 73 72h239v568zM350 696.5c0 24.2-7.5 31.4-21.9 31.4-9 0-18.4-5.8-24.8-18.5L272.9 732c13.4 22.9 32.3 34.2 61.3 34.2 41.6 0 60.8-29.9 60.8-66.2V577h-45v119.5zM501.3 577H437v186h44v-62h21.6c39.1 0 73.1-19.6 73.1-63.6 0-45.8-33.5-60.4-74.4-60.4zm-.8 89H481v-53h18.2c21.5 0 33.4 6.2 33.4 24.9 0 18.1-10.5 28.1-32.1 28.1zm182.5-9v36h30v30.1c-4 2.9-11 4.7-17.7 4.7-34.3 0-50.7-21.4-50.7-58.2 0-36.1 19.7-57.4 47.1-57.4 15.3 0 25 6.2 34 14.4l23.7-28.3c-12.7-12.8-32.1-24.2-59.2-24.2-49.6 0-91.1 35.3-91.1 97 0 62.7 40 95.1 91.5 95.1 25.9 0 49.2-10.2 61.5-22.6V657H683z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-jpg</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-ppt">
                <svg viewBox="64 64 896 896" class="" data-icon="file-ppt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M424 476c-4.4 0-8 3.6-8 8v276c0 4.4 3.6 8 8 8h32.5c4.4 0 8-3.6 8-8v-95.5h63.3c59.4 0 96.2-38.9 96.2-94.1 0-54.5-36.3-94.3-96-94.3H424zm150.6 94.3c0 43.4-26.5 54.3-71.2 54.3h-38.9V516.2h56.2c33.8 0 53.9 19.7 53.9 54.1zm280-281.7L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-ppt</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-markdown">
                <svg viewBox="64 64 896 896" class="" data-icon="file-markdown" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2a12 12 0 0 0 11 7.1H524c4.7 0 9-2.8 11-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H641c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191-83.2-191z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-markdown</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-add">
                <svg viewBox="64 64 896 896" class="" data-icon="file-add" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM544 472c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v108H372c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h108v108c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h108c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V472z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-add</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-folder">
                <svg viewBox="64 64 896 896" class="" data-icon="folder" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">folder</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-folder-open">
                <svg viewBox="64 64 896 896" class="" data-icon="folder-open" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">folder-open</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-folder-add">
                <svg viewBox="64 64 896 896" class="" data-icon="folder-add" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M484 443.1V528h-84.5c-4.1 0-7.5 3.1-7.5 7v42c0 3.8 3.4 7 7.5 7H484v84.9c0 3.9 3.2 7.1 7 7.1h42c3.9 0 7-3.2 7-7.1V584h84.5c4.1 0 7.5-3.2 7.5-7v-42c0-3.9-3.4-7-7.5-7H540v-84.9c0-3.9-3.1-7.1-7-7.1h-42c-3.8 0-7 3.2-7 7.1zm396-144.7H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">folder-add</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-hdd">
                <svg viewBox="64 64 896 896" class="" data-icon="hdd" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM496 208H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm328 244a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">hdd</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-frown">
                <svg viewBox="64 64 896 896" class="" data-icon="frown" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM512 533c-85.5 0-155.6 67.3-160 151.6a8 8 0 0 0 8 8.4h48.1c4.2 0 7.8-3.2 8.1-7.4C420 636.1 461.5 597 512 597s92.1 39.1 95.8 88.6c.3 4.2 3.9 7.4 8.1 7.4H664a8 8 0 0 0 8-8.4C667.6 600.3 597.5 533 512 533z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">frown</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-meh">
                <svg viewBox="64 64 896 896" class="" data-icon="meh" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM664 565H360c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">meh</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-smile">
                <svg viewBox="64 64 896 896" class="" data-icon="smile" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM664 533h-48.1c-4.2 0-7.8 3.2-8.1 7.4C604 589.9 562.5 629 512 629s-92.1-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 0 0-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 0 0-8-8.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">smile</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-inbox">
                <svg viewBox="0 0 1024 1024" class="" data-icon="inbox" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">inbox</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-laptop">
                <svg viewBox="64 64 896 896" class="" data-icon="laptop" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M956.9 845.1L896.4 632V168c0-17.7-14.3-32-32-32h-704c-17.7 0-32 14.3-32 32v464L67.9 845.1C60.4 866 75.8 888 98 888h828.8c22.2 0 37.6-22 30.1-42.9zM200.4 208h624v395h-624V208zm228.3 608l8.1-37h150.3l8.1 37H428.7zm224 0l-19.1-86.7c-.8-3.7-4.1-6.3-7.8-6.3H398.2c-3.8 0-7 2.6-7.8 6.3L371.3 816H151l42.3-149h638.2l42.3 149H652.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">laptop</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-appstore">
                <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">appstore</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-link">
                <svg viewBox="64 64 896 896" class="" data-icon="link" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">link</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-mail">
                <svg viewBox="64 64 896 896" class="" data-icon="mail" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0 0 68.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">mail</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-mobile">
                <svg viewBox="64 64 896 896" class="" data-icon="mobile" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">mobile</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-notification">
                <svg viewBox="64 64 896 896" class="" data-icon="notification" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.7c-3.7 11.6-5.7 23.9-5.7 36.4 0 65.9 53.8 119.5 120 119.5 55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3 16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112zM344 762.3c-26.5 0-48-21.4-48-47.8 0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1zm496 58.4L318.8 611.3l-12.9-5.2H184V417.9h121.9l12.9-5.2L840 203.3v617.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">notification</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-paper-clip">
                <svg viewBox="64 64 896 896" class="" data-icon="paper-clip" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">paper-clip</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-picture">
                <svg viewBox="64 64 896 896" class="" data-icon="picture" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792zm0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2zM304 456a88 88 0 1 0 0-176 88 88 0 0 0 0 176zm0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">picture</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-poweroff">
                <svg viewBox="64 64 896 896" class="" data-icon="poweroff" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M705.6 124.9a8 8 0 0 0-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0 1 62.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0 1 27.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 0 1-76.3 113.3 353.06 353.06 0 0 1-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 0 1-113.2-76.4A355.92 355.92 0 0 1 184 650.4a355 355 0 0 1-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">poweroff</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-reload">
                <svg viewBox="64 64 896 896" class="" data-icon="reload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 0 0-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 0 1 655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 0 1 279 755.2a342.16 342.16 0 0 1-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 0 1 109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">reload</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-search">
                <svg viewBox="64 64 896 896" class="" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M608 112c-167.9 0-304 136.1-304 304 0 70.3 23.9 135 63.9 186.5L114.3 856.1a8.03 8.03 0 0 0 0 11.3l42.3 42.3c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6C473 696.1 537.7 720 608 720c167.9 0 304-136.1 304-304S775.9 112 608 112zm161.2 465.2C726.2 620.3 668.9 644 608 644s-118.2-23.7-161.2-66.8C403.7 534.2 380 476.9 380 416s23.7-118.2 66.8-161.2c43-43.1 100.3-66.8 161.2-66.8s118.2 23.7 161.2 66.8c43.1 43 66.8 100.3 66.8 161.2s-23.7 118.2-66.8 161.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">search</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-setting">
                <svg viewBox="64 64 896 896" class="" data-icon="setting" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">setting</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-share-alt">
                <svg viewBox="64 64 896 896" class="" data-icon="share-alt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 0 0 0-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">share-alt</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-shopping-cart">
                <svg viewBox="0 0 1024 1024" class="" data-icon="shopping-cart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">shopping-cart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-tablet">
                <svg viewBox="64 64 896 896" class="" data-icon="tablet" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M800 64H224c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h576c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zm-8 824H232V136h560v752zM472 784a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">tablet</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-tag">
                <svg viewBox="64 64 896 896" class="" data-icon="tag" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8zM459.7 834.7L189.3 564.3 589 164.6 836 188l23.4 247-399.7 399.7zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">tag</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-tags">
                <svg viewBox="64 64 896 896" class="" data-icon="tags" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-.2-4.7.6-6.3 2.3L137.7 444.8a8.03 8.03 0 0 0 0 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0zm62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9zm60.16 186.23a48 48 0 1 0 67.88-67.89 48 48 0 1 0-67.88 67.89zM889.7 539.8l-39.6-39.5a8.03 8.03 0 0 0-11.3 0l-362 361.3-237.6-237a8.03 8.03 0 0 0-11.3 0l-39.6 39.5a8.03 8.03 0 0 0 0 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">tags</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-to-top">
                <svg viewBox="64 64 896 896" class="" data-icon="to-top" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M885 780H165c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM400 325.7h73.9V664c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V325.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 171a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">to-top</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-upload">
                <svg viewBox="64 64 896 896" class="" data-icon="upload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">upload</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-user">
                <svg viewBox="64 64 896 896" class="" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">user</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-video-camera">
                <svg viewBox="64 64 896 896" class="" data-icon="video-camera" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">video-camera</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-home">
                <svg viewBox="64 64 896 896" class="" data-icon="home" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">home</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-loading">
                <svg viewBox="0 0 1024 1024" class="anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">loading</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-loading-3-quarters">
                <svg viewBox="0 0 1024 1024" class="" data-icon="loading-3-quarters" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">loading-3-quarters</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-cloud-upload">
                <svg viewBox="64 64 896 896" class="" data-icon="cloud-upload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"></path>
                  <path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">cloud-upload</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-star">
                <svg viewBox="64 64 896 896" class="" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">star</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-heart">
                <svg viewBox="64 64 896 896" class="" data-icon="heart" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">heart</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-environment">
                <svg viewBox="64 64 896 896" class="" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">environment</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-eye">
                <svg viewBox="64 64 896 896" class="" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">eye</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-camera">
                <svg viewBox="64 64 896 896" class="" data-icon="camera" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M864 248H728l-32.4-90.8a32.07 32.07 0 0 0-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80zm8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456zM512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">camera</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-save">
                <svg viewBox="64 64 896 896" class="" data-icon="save" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">save</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-team">
                <svg viewBox="64 64 896 896" class="" data-icon="team" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M824.2 699.9a301.55 301.55 0 0 0-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 0 1 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 0 0 8-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 0 1 612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">team</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-solution">
                <svg viewBox="64 64 896 896" class="" data-icon="solution" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M688 264c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48zm-8 136H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM480 544H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-48 308H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm356.8-74.4c29-26.3 47.2-64.3 47.2-106.6 0-79.5-64.5-144-144-144s-144 64.5-144 144c0 42.3 18.2 80.3 47.2 106.6-57 32.5-96.2 92.7-99.2 162.1-.2 4.5 3.5 8.3 8 8.3h48.1c4.2 0 7.7-3.3 8-7.6C564 871.2 621.7 816 692 816s128 55.2 131.9 124.4c.2 4.2 3.7 7.6 8 7.6H880c4.6 0 8.2-3.8 8-8.3-2.9-69.5-42.2-129.6-99.2-162.1zM692 591c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">solution</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-phone">
                <svg viewBox="64 64 896 896" class="" data-icon="phone" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 0 1-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 0 0-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 0 0 285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">phone</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-filter">
                <svg viewBox="64 64 896 896" class="" data-icon="filter" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">filter</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-exception">
                <svg viewBox="64 64 896 896" class="" data-icon="exception" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM640 812a32 32 0 1 0 64 0 32 32 0 1 0-64 0zm12-64h40c4.4 0 8-3.6 8-8V628c0-4.4-3.6-8-8-8h-40c-4.4 0-8 3.6-8 8v112c0 4.4 3.6 8 8 8zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">exception</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-export">
                <svg viewBox="64 64 896 896" class="" data-icon="export" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.4 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.3-3.5-7.7-7.7-7.7zm18.6-251.7L765 393.7c-5.3-4.2-13-.4-13 6.3v76H438c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">export</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-customer-service">
                <svg viewBox="64 64 896 896" class="" data-icon="customer-service" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 128c-212.1 0-384 171.9-384 384v360c0 13.3 10.7 24 24 24h184c35.3 0 64-28.7 64-64V624c0-35.3-28.7-64-64-64H200v-48c0-172.3 139.7-312 312-312s312 139.7 312 312v48H688c-35.3 0-64 28.7-64 64v208c0 35.3 28.7 64 64 64h184c13.3 0 24-10.7 24-24V512c0-212.1-171.9-384-384-384zM328 632v192H200V632h128zm496 192H696V632h128v192z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">customer-service</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-qrcode">
                <svg viewBox="64 64 896 896" class="" data-icon="qrcode" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M468 128H160c-17.7 0-32 14.3-32 32v308c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V136c0-4.4-3.6-8-8-8zm-56 284H192V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210H136c-4.4 0-8 3.6-8 8v308c0 17.7 14.3 32 32 32h308c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zm-56 284H192V612h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm590-630H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V160c0-17.7-14.3-32-32-32zm-32 284H612V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210h-48c-4.4 0-8 3.6-8 8v134h-78V556c0-4.4-3.6-8-8-8H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h78v102c0 4.4 3.6 8 8 8h190c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zM746 832h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm142 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">qrcode</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-scan">
                <svg viewBox="64 64 896 896" class="" data-icon="scan" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M136 384h56c4.4 0 8-3.6 8-8V200h176c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H196c-37.6 0-68 30.4-68 68v180c0 4.4 3.6 8 8 8zm512-184h176v176c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V196c0-37.6-30.4-68-68-68H648c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM376 824H200V648c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v180c0 37.6 30.4 68 68 68h180c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm512-184h-56c-4.4 0-8 3.6-8 8v176H648c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h180c37.6 0 68-30.4 68-68V648c0-4.4-3.6-8-8-8zm16-164H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">scan</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-like">
                <svg viewBox="64 64 896 896" class="" data-icon="like" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">like</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dislike">
                <svg viewBox="64 64 896 896" class="" data-icon="dislike" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dislike</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-message">
                <svg viewBox="64 64 896 896" class="" data-icon="message" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M464 512a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm200 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm-400 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">message</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pay-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="pay-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm159.6-585h-59.5c-3 0-5.8 1.7-7.1 4.4l-90.6 180H511l-90.6-180a8 8 0 0 0-7.1-4.4h-60.7c-1.3 0-2.6.3-3.8 1-3.9 2.1-5.3 7-3.2 10.9L457 515.7h-61.4c-4.4 0-8 3.6-8 8v29.9c0 4.4 3.6 8 8 8h81.7V603h-81.7c-4.4 0-8 3.6-8 8v29.9c0 4.4 3.6 8 8 8h81.7V717c0 4.4 3.6 8 8 8h54.3c4.4 0 8-3.6 8-8v-68.1h82c4.4 0 8-3.6 8-8V611c0-4.4-3.6-8-8-8h-82v-41.5h82c4.4 0 8-3.6 8-8v-29.9c0-4.4-3.6-8-8-8h-62l111.1-204.8c.6-1.2 1-2.5 1-3.8-.1-4.4-3.7-8-8.1-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pay-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-calculator">
                <svg viewBox="64 64 896 896" class="" data-icon="calculator" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M251.2 387H320v68.8c0 1.8 1.8 3.2 4 3.2h48c2.2 0 4-1.4 4-3.3V387h68.8c1.8 0 3.2-1.8 3.2-4v-48c0-2.2-1.4-4-3.3-4H376v-68.8c0-1.8-1.8-3.2-4-3.2h-48c-2.2 0-4 1.4-4 3.2V331h-68.8c-1.8 0-3.2 1.8-3.2 4v48c0 2.2 1.4 4 3.2 4zm328 0h193.6c1.8 0 3.2-1.8 3.2-4v-48c0-2.2-1.4-4-3.3-4H579.2c-1.8 0-3.2 1.8-3.2 4v48c0 2.2 1.4 4 3.2 4zm0 265h193.6c1.8 0 3.2-1.8 3.2-4v-48c0-2.2-1.4-4-3.3-4H579.2c-1.8 0-3.2 1.8-3.2 4v48c0 2.2 1.4 4 3.2 4zm0 104h193.6c1.8 0 3.2-1.8 3.2-4v-48c0-2.2-1.4-4-3.3-4H579.2c-1.8 0-3.2 1.8-3.2 4v48c0 2.2 1.4 4 3.2 4zm-195.7-81l61.2-74.9c4.3-5.2.7-13.1-5.9-13.1H388c-2.3 0-4.5 1-5.9 2.9l-34 41.6-34-41.6a7.85 7.85 0 0 0-5.9-2.9h-50.9c-6.6 0-10.2 7.9-5.9 13.1l61.2 74.9-62.7 76.8c-4.4 5.2-.8 13.1 5.8 13.1h50.8c2.3 0 4.5-1 5.9-2.9l35.5-43.5 35.5 43.5c1.5 1.8 3.7 2.9 5.9 2.9h50.8c6.6 0 10.2-7.9 5.9-13.1L383.5 675zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-36 732H180V180h664v664z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">calculator</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pushpin">
                <svg viewBox="64 64 896 896" class="" data-icon="pushpin" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3a33.23 33.23 0 0 0-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 0 0-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8zM666.2 549.3l-24.5 24.5 3.8 34.4a259.92 259.92 0 0 1-30.4 153.9L262 408.8c12.9-7.1 26.3-13.1 40.3-17.9 27.2-9.4 55.7-14.1 84.7-14.1 9.6 0 19.3.5 28.9 1.6l34.4 3.8 24.5-24.5L608.5 224 800 415.5 666.2 549.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pushpin</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bulb">
                <svg viewBox="64 64 896 896" class="" data-icon="bulb" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bulb</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-select">
                <svg viewBox="64 64 896 896" class="" data-icon="select" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h360c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H184V184h656v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V144c0-17.7-14.3-32-32-32zM653.3 599.4l52.2-52.2a8.01 8.01 0 0 0-4.7-13.6l-179.4-21c-5.1-.6-9.5 3.7-8.9 8.9l21 179.4c.8 6.6 8.9 9.4 13.6 4.7l52.4-52.4 256.2 256.2c3.1 3.1 8.2 3.1 11.3 0l42.4-42.4c3.1-3.1 3.1-8.2 0-11.3L653.3 599.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">select</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-switcher">
                <svg viewBox="64 64 896 896" class="" data-icon="switcher" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M752 240H144c-17.7 0-32 14.3-32 32v608c0 17.7 14.3 32 32 32h608c17.7 0 32-14.3 32-32V272c0-17.7-14.3-32-32-32zm-40 600H184V312h528v528zm168-728H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h576v576c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V144c0-17.7-14.3-32-32-32zM300 550h296v64H300z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">switcher</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-rocket">
                <svg viewBox="64 64 896 896" class="" data-icon="rocket" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M864 736c0-111.6-65.4-208-160-252.9V317.3c0-15.1-5.3-29.7-15.1-41.2L536.5 95.4C530.1 87.8 521 84 512 84s-18.1 3.8-24.5 11.4L335.1 276.1a63.97 63.97 0 0 0-15.1 41.2v165.8C225.4 528 160 624.4 160 736h156.5c-2.3 7.2-3.5 15-3.5 23.8 0 22.1 7.6 43.7 21.4 60.8a97.2 97.2 0 0 0 43.1 30.6c23.1 54 75.6 88.8 134.5 88.8 29.1 0 57.3-8.6 81.4-24.8 23.6-15.8 41.9-37.9 53-64a97 97 0 0 0 43.1-30.5 97.52 97.52 0 0 0 21.4-60.8c0-8.4-1.1-16.4-3.1-23.8H864zM762.3 621.4c9.4 14.6 17 30.3 22.5 46.6H700V558.7a211.6 211.6 0 0 1 62.3 62.7zM388 483.1V318.8l124-147 124 147V668H388V483.1zM239.2 668c5.5-16.3 13.1-32 22.5-46.6 16.3-25.2 37.5-46.5 62.3-62.7V668h-84.8zm388.9 116.2c-5.2 3-11.2 4.2-17.1 3.4l-19.5-2.4-2.8 19.4c-5.4 37.9-38.4 66.5-76.7 66.5-38.3 0-71.3-28.6-76.7-66.5l-2.8-19.5-19.5 2.5a27.7 27.7 0 0 1-17.1-3.5c-8.7-5-14.1-14.3-14.1-24.4 0-10.6 5.9-19.4 14.6-23.8h231.3c8.8 4.5 14.6 13.3 14.6 23.8-.1 10.2-5.5 19.6-14.2 24.5zM464 400a48 48 0 1 0 96 0 48 48 0 1 0-96 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">rocket</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bell">
                <svg viewBox="64 64 896 896" class="" data-icon="bell" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M816 768h-24V428c0-141.1-104.3-257.7-240-277.1V112c0-22.1-17.9-40-40-40s-40 17.9-40 40v38.9c-135.7 19.4-240 136-240 277.1v340h-24c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h216c0 61.8 50.2 112 112 112s112-50.2 112-112h216c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM512 888c-26.5 0-48-21.5-48-48h96c0 26.5-21.5 48-48 48zM304 768V428c0-55.6 21.6-107.8 60.9-147.1S456.4 220 512 220c55.6 0 107.8 21.6 147.1 60.9S720 372.4 720 428v340H304z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bell</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-disconnect">
                <svg viewBox="64 64 896 896" class="" data-icon="disconnect" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832.6 191.4c-84.6-84.6-221.5-84.6-306 0l-96.9 96.9 51 51 96.9-96.9c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204l-96.9 96.9 51.1 51.1 96.9-96.9c84.4-84.6 84.4-221.5-.1-306.1zM446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l96.9-96.9-51.1-51.1-96.9 96.9c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l96.9-96.9-51-51-96.8 97zM260.3 209.4a8.03 8.03 0 0 0-11.3 0L209.4 249a8.03 8.03 0 0 0 0 11.3l554.4 554.4c3.1 3.1 8.2 3.1 11.3 0l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3L260.3 209.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">disconnect</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-database">
                <svg viewBox="64 64 896 896" class="" data-icon="database" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 272a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 272a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">database</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-compass">
                <svg viewBox="64 64 896 896" class="" data-icon="compass" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm198.4-588.1a32 32 0 0 0-24.5.5L414.9 415 296.4 686c-3.6 8.2-3.6 17.5 0 25.7 3.4 7.8 9.7 13.9 17.7 17 3.8 1.5 7.7 2.2 11.7 2.2 4.4 0 8.7-.9 12.8-2.7l271-118.6 118.5-271a32.06 32.06 0 0 0-17.7-42.7zM576.8 534.4l26.2 26.2-42.4 42.4-26.2-26.2L380 644.4 447.5 490 422 464.4l42.4-42.4 25.5 25.5L644.4 380l-67.6 154.4zM464.4 422L422 464.4l25.5 25.6 86.9 86.8 26.2 26.2 42.4-42.4-26.2-26.2-86.8-86.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">compass</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-barcode">
                <svg viewBox="64 64 896 896" class="" data-icon="barcode" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M120 160H72c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8zm833 0h-48c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8zM200 736h112c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8H200c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8zm321 0h48c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8zm126 0h178c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8H647c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8zm-255 0h48c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8zm-79 64H201c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm257 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm256 0H648c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h178c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-385 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">barcode</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-hourglass">
                <svg viewBox="64 64 896 896" class="" data-icon="hourglass" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M742 318V184h86c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H196c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h86v134c0 81.5 42.4 153.2 106.4 194-64 40.8-106.4 112.5-106.4 194v134h-86c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h632c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-86V706c0-81.5-42.4-153.2-106.4-194 64-40.8 106.4-112.5 106.4-194zm-72 388v134H354V706c0-42.2 16.4-81.9 46.3-111.7C430.1 564.4 469.8 548 512 548s81.9 16.4 111.7 46.3C653.6 624.1 670 663.8 670 706zm0-388c0 42.2-16.4 81.9-46.3 111.7C593.9 459.6 554.2 476 512 476s-81.9-16.4-111.7-46.3A156.63 156.63 0 0 1 354 318V184h316v134z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">hourglass</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-key">
                <svg viewBox="64 64 896 896" class="" data-icon="key" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M608 112c-167.9 0-304 136.1-304 304 0 70.3 23.9 135 63.9 186.5l-41.1 41.1-62.3-62.3a8.15 8.15 0 0 0-11.4 0l-39.8 39.8a8.15 8.15 0 0 0 0 11.4l62.3 62.3-44.9 44.9-62.3-62.3a8.15 8.15 0 0 0-11.4 0l-39.8 39.8a8.15 8.15 0 0 0 0 11.4l62.3 62.3-65.3 65.3a8.03 8.03 0 0 0 0 11.3l42.3 42.3c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6A304.06 304.06 0 0 0 608 720c167.9 0 304-136.1 304-304S775.9 112 608 112zm161.2 465.2C726.2 620.3 668.9 644 608 644c-60.9 0-118.2-23.7-161.2-66.8-43.1-43-66.8-100.3-66.8-161.2 0-60.9 23.7-118.2 66.8-161.2 43-43.1 100.3-66.8 161.2-66.8 60.9 0 118.2 23.7 161.2 66.8 43.1 43 66.8 100.3 66.8 161.2 0 60.9-23.7 118.2-66.8 161.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">key</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-flag">
                <svg viewBox="64 64 896 896" class="" data-icon="flag" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">flag</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-layout">
                <svg viewBox="64 64 896 896" class="" data-icon="layout" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-696 72h136v656H184V184zm656 656H384V384h456v456zM384 320V184h456v136H384z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">layout</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-printer">
                <svg viewBox="64 64 896 896" class="" data-icon="printer" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">printer</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-sound">
                <svg viewBox="64 64 896 896" class="" data-icon="sound" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M625.9 115c-5.9 0-11.9 1.6-17.4 5.3L254 352H90c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h164l354.5 231.7c5.5 3.6 11.6 5.3 17.4 5.3 16.7 0 32.1-13.3 32.1-32.1V147.1c0-18.8-15.4-32.1-32.1-32.1zM586 803L293.4 611.7l-18-11.7H146V424h129.4l17.9-11.7L586 221v582zm348-327H806c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16h128c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16zm-41.9 261.8l-110.3-63.7a15.9 15.9 0 0 0-21.7 5.9l-19.9 34.5c-4.4 7.6-1.8 17.4 5.8 21.8L856.3 800a15.9 15.9 0 0 0 21.7-5.9l19.9-34.5c4.4-7.6 1.7-17.4-5.8-21.8zM760 344a15.9 15.9 0 0 0 21.7 5.9L892 286.2c7.6-4.4 10.2-14.2 5.8-21.8L878 230a15.9 15.9 0 0 0-21.7-5.9L746 287.8a15.99 15.99 0 0 0-5.8 21.8L760 344z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">sound</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-usb">
                <svg viewBox="64 64 896 896" class="" data-icon="usb" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M760 432V144c0-17.7-14.3-32-32-32H296c-17.7 0-32 14.3-32 32v288c-66.2 0-120 52.1-120 116v356c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V548c0-24.3 21.6-44 48.1-44h495.8c26.5 0 48.1 19.7 48.1 44v356c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V548c0-63.9-53.8-116-120-116zm-424 0V184h352v248H336zm120-184h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm160 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">usb</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-skin">
                <svg viewBox="64 64 896 896" class="" data-icon="skin" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M870 126H663.8c-17.4 0-32.9 11.9-37 29.3C614.3 208.1 567 246 512 246s-102.3-37.9-114.8-90.7a37.93 37.93 0 0 0-37-29.3H154a44 44 0 0 0-44 44v252a44 44 0 0 0 44 44h75v388a44 44 0 0 0 44 44h478a44 44 0 0 0 44-44V466h75a44 44 0 0 0 44-44V170a44 44 0 0 0-44-44zm-28 268H723v432H301V394H182V198h153.3c28.2 71.2 97.5 120 176.7 120s148.5-48.8 176.7-120H842v196z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">skin</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-tool">
                <svg viewBox="64 64 896 896" class="" data-icon="tool" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M876.6 239.5c-.5-.9-1.2-1.8-2-2.5-5-5-13.1-5-18.1 0L684.2 409.3l-67.9-67.9L788.7 169c.8-.8 1.4-1.6 2-2.5 3.6-6.1 1.6-13.9-4.5-17.5-98.2-58-226.8-44.7-311.3 39.7-67 67-89.2 162-66.5 247.4l-293 293c-3 3-2.8 7.9.3 11l169.7 169.7c3.1 3.1 8.1 3.3 11 .3l292.9-292.9c85.5 22.8 180.5.7 247.6-66.4 84.4-84.5 97.7-213.1 39.7-311.3zM786 499.8c-58.1 58.1-145.3 69.3-214.6 33.6l-8.8 8.8-.1-.1-274 274.1-79.2-79.2 230.1-230.1s0 .1.1.1l52.8-52.8c-35.7-69.3-24.5-156.5 33.6-214.6a184.2 184.2 0 0 1 144-53.5L537 318.9a32.05 32.05 0 0 0 0 45.3l124.5 124.5a32.05 32.05 0 0 0 45.3 0l132.8-132.8c3.7 51.8-14.4 104.8-53.6 143.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">tool</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-sync">
                <svg viewBox="64 64 896 896" class="" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 0 1 755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 0 1 512.1 856a342.24 342.24 0 0 1-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 0 0-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 0 0-8-8.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">sync</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-wifi">
                <svg viewBox="64 64 896 896" class="" data-icon="wifi" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M723 620.5C666.8 571.6 593.4 542 513 542s-153.8 29.6-210.1 78.6a8.1 8.1 0 0 0-.8 11.2l36 42.9c2.9 3.4 8 3.8 11.4.9C393.1 637.2 450.3 614 513 614s119.9 23.2 163.5 61.5c3.4 2.9 8.5 2.5 11.4-.9l36-42.9c2.8-3.3 2.4-8.3-.9-11.2zm117.4-140.1C751.7 406.5 637.6 362 513 362s-238.7 44.5-327.5 118.4a8.05 8.05 0 0 0-1 11.3l36 42.9c2.8 3.4 7.9 3.8 11.2 1C308 472.2 406.1 434 513 434s205 38.2 281.2 101.6c3.4 2.8 8.4 2.4 11.2-1l36-42.9c2.8-3.4 2.4-8.5-1-11.3zm116.7-139C835.7 241.8 680.3 182 511 182c-168.2 0-322.6 59-443.7 157.4a8 8 0 0 0-1.1 11.4l36 42.9c2.8 3.3 7.8 3.8 11.1 1.1C222 306.7 360.3 254 511 254c151.8 0 291 53.5 400 142.7 3.4 2.8 8.4 2.3 11.2-1.1l36-42.9c2.9-3.4 2.4-8.5-1.1-11.3zM448 778a64 64 0 1 0 128 0 64 64 0 1 0-128 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">wifi</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-car">
                <svg viewBox="64 64 896 896" class="" data-icon="car" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M380 704h264c4.4 0 8-3.6 8-8v-84c0-4.4-3.6-8-8-8h-40c-4.4 0-8 3.6-8 8v36H428v-36c0-4.4-3.6-8-8-8h-40c-4.4 0-8 3.6-8 8v84c0 4.4 3.6 8 8 8zm340-123a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm239-167.6L935.3 372a8 8 0 0 0-10.9-2.9l-50.7 29.6-78.3-216.2a63.9 63.9 0 0 0-60.9-44.4H301.2c-34.7 0-65.5 22.4-76.2 55.5l-74.6 205.2-50.8-29.6a8 8 0 0 0-10.9 2.9L65 413.4c-2.2 3.8-.9 8.6 2.9 10.8l60.4 35.2-14.5 40c-1.2 3.2-1.8 6.6-1.8 10v348.2c0 15.7 11.8 28.4 26.3 28.4h67.6c12.3 0 23-9.3 25.6-22.3l7.7-37.7h545.6l7.7 37.7c2.7 13 13.3 22.3 25.6 22.3h67.6c14.5 0 26.3-12.7 26.3-28.4V509.4c0-3.4-.6-6.8-1.8-10l-14.5-40 60.3-35.2a8 8 0 0 0 3-10.8zM840 517v237H184V517l15.6-43h624.8l15.6 43zM292.7 218.1l.5-1.3.4-1.3c1.1-3.3 4.1-5.5 7.6-5.5h427.6l75.4 208H220l72.7-199.9zM224 581a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">car</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-schedule">
                <svg viewBox="64 64 896 896" class="" data-icon="schedule" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 224H768v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H548v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H328v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H96c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32zm-40 568H136V296h120v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h120v496zM416 496H232c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm0 136H232c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm308.2-177.4L620.6 598.3l-52.8-73.1c-3-4.2-7.8-6.6-12.9-6.6H500c-6.5 0-10.3 7.4-6.5 12.7l114.1 158.2a15.9 15.9 0 0 0 25.8 0l165-228.7c3.8-5.3 0-12.7-6.5-12.7H737c-5-.1-9.8 2.4-12.8 6.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">schedule</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-user-add">
                <svg viewBox="64 64 896 896" class="" data-icon="user-add" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">user-add</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-user-delete">
                <svg viewBox="64 64 896 896" class="" data-icon="user-delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M678.3 655.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 518 759.6 444.7 759.6 362c0-137-110.8-248-247.5-248S264.7 225 264.7 362c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 901.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 641.2 432.2 610 512.2 610c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 534c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 362c0-45.9 17.9-89.1 50.3-121.6S466.3 190 512.2 190s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 362c0 45.9-17.9 89.1-50.3 121.6C601.1 516.1 558 534 512.2 534zM880 772H640c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">user-delete</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-usergroup-add">
                <svg viewBox="64 64 896 896" class="" data-icon="usergroup-add" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8zM824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-.1 34.2-13.4 66.3-37.6 90.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">usergroup-add</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-usergroup-delete">
                <svg viewBox="64 64 896 896" class="" data-icon="usergroup-delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 784H664c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h224c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7zM824 484c0-109.4-87.9-198.3-196.9-200C516.3 282.3 424 373.2 424 484c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C357 754.6 326 826.8 324 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 707.7 563 684 624 684c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 598.7 658.2 612 624 612s-66.3-13.3-90.5-37.5a127.26 127.26 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-.1 34.2-13.4 66.3-37.6 90.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">usergroup-delete</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-man">
                <svg viewBox="64 64 896 896" class="" data-icon="man" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M874 120H622c-3.3 0-6 2.7-6 6v56c0 3.3 2.7 6 6 6h160.4L583.1 387.3c-50-38.5-111-59.3-175.1-59.3-76.9 0-149.3 30-203.6 84.4S120 539.1 120 616s30 149.3 84.4 203.6C258.7 874 331.1 904 408 904s149.3-30 203.6-84.4C666 765.3 696 692.9 696 616c0-64.1-20.8-124.9-59.2-174.9L836 241.9V402c0 3.3 2.7 6 6 6h56c3.3 0 6-2.7 6-6V150c0-16.5-13.5-30-30-30zM408 828c-116.9 0-212-95.1-212-212s95.1-212 212-212 212 95.1 212 212-95.1 212-212 212z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">man</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-woman">
                <svg viewBox="64 64 896 896" class="" data-icon="woman" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M712.8 548.8c53.6-53.6 83.2-125 83.2-200.8 0-75.9-29.5-147.2-83.2-200.8C659.2 93.6 587.8 64 512 64s-147.2 29.5-200.8 83.2C257.6 200.9 228 272.1 228 348c0 63.8 20.9 124.4 59.4 173.9 7.3 9.4 15.2 18.3 23.7 26.9 8.5 8.5 17.5 16.4 26.8 23.7 39.6 30.8 86.3 50.4 136.1 57V736H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h114v140c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V812h114c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H550V629.5c61.5-8.2 118.2-36.1 162.8-80.7zM512 556c-55.6 0-107.7-21.6-147.1-60.9C325.6 455.8 304 403.6 304 348s21.6-107.7 60.9-147.1C404.2 161.5 456.4 140 512 140s107.7 21.6 147.1 60.9C698.4 240.2 720 292.4 720 348s-21.6 107.7-60.9 147.1C619.7 534.4 567.6 556 512 556z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">woman</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-shop">
                <svg viewBox="64 64 896 896" class="" data-icon="shop" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9zM214 184h596v88H214v-88zm362 656.1H448V736h128v104.1zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4 22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3-40.8 0-76.4-22.1-95.2-54.9-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 0 1 512 544c-40.7 0-76.2-22-95-54.7-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 0 1-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5v91.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">shop</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-gift">
                <svg viewBox="64 64 896 896" class="" data-icon="gift" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 310H732.4c13.6-21.4 21.6-46.8 21.6-74 0-76.1-61.9-138-138-138-41.4 0-78.7 18.4-104 47.4-25.3-29-62.6-47.4-104-47.4-76.1 0-138 61.9-138 138 0 27.2 7.9 52.6 21.6 74H144c-17.7 0-32 14.3-32 32v200c0 4.4 3.6 8 8 8h40v344c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V550h40c4.4 0 8-3.6 8-8V342c0-17.7-14.3-32-32-32zm-334-74c0-38.6 31.4-70 70-70s70 31.4 70 70-31.4 70-70 70h-70v-70zm-138-70c38.6 0 70 31.4 70 70v70h-70c-38.6 0-70-31.4-70-70s31.4-70 70-70zM180 482V378h298v104H180zm48 68h250v308H228V550zm568 308H546V550h250v308zm48-376H546V378h298v104z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">gift</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-idcard">
                <svg viewBox="64 64 896 896" class="" data-icon="idcard" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560zM610.3 476h123.4c1.3 0 2.3-3.6 2.3-8v-48c0-4.4-1-8-2.3-8H610.3c-1.3 0-2.3 3.6-2.3 8v48c0 4.4 1 8 2.3 8zm4.8 144h185.7c3.9 0 7.1-3.6 7.1-8v-48c0-4.4-3.2-8-7.1-8H615.1c-3.9 0-7.1 3.6-7.1 8v48c0 4.4 3.2 8 7.1 8zM224 673h43.9c4.2 0 7.6-3.3 7.9-7.5 3.8-50.5 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H522a8 8 0 0 0 8-8.4c-2.8-53.3-32-99.7-74.6-126.1a111.8 111.8 0 0 0 29.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 0 0-74.6 126.1c-.4 4.6 3.2 8.4 7.8 8.4zm149-262c28.5 0 51.7 23.3 51.7 52s-23.2 52-51.7 52-51.7-23.3-51.7-52 23.2-52 51.7-52z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">idcard</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-medicine-box">
                <svg viewBox="64 64 896 896" class="" data-icon="medicine-box" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M839.2 278.1a32 32 0 0 0-30.4-22.1H736V144c0-17.7-14.3-32-32-32H320c-17.7 0-32 14.3-32 32v112h-72.8a31.9 31.9 0 0 0-30.4 22.1L112 502v378c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V502l-72.8-223.9zM360 184h304v72H360v-72zm480 656H184V513.4L244.3 328h535.4L840 513.4V840zM652 572H544V464c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v108H372c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h108v108c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V636h108c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">medicine-box</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-red-envelope">
                <svg viewBox="64 64 896 896" class="" data-icon="red-envelope" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M440.6 462.6a8.38 8.38 0 0 0-7.5-4.6h-48.8c-1.3 0-2.6.4-3.9 1a8.4 8.4 0 0 0-3.4 11.4l87.4 161.1H419c-4.6 0-8.4 3.8-8.4 8.4V665c0 4.6 3.8 8.4 8.4 8.4h63V702h-63c-4.6 0-8.4 3.8-8.4 8.4v25.1c0 4.6 3.8 8.4 8.4 8.4h63v49.9c0 4.6 3.8 8.4 8.4 8.4h43.7c4.6 0 8.4-3.8 8.4-8.4v-49.9h63.3c4.7 0 8.4-3.8 8.2-8.5v-25c0-4.6-3.8-8.4-8.4-8.4h-63.3v-28.6h63.3c4.6 0 8.4-3.8 8.4-8.4v-25.1c0-4.6-3.8-8.4-8.4-8.4h-45.9l87.2-161a8.45 8.45 0 0 0-7.4-12.4h-47.8c-3.1 0-6 1.8-7.5 4.6l-71.9 141.9-71.7-142zM832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-40 824H232V193.1l260.3 204.1c11.6 9.1 27.9 9.1 39.5 0L792 193.1V888zm0-751.3h-31.7L512 331.3 263.7 136.7H232v-.7h560v.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">red-envelope</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-coffee">
                <svg viewBox="0 0 1024 1024" class="" data-icon="coffee" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M275 281c19.9 0 36-16.1 36-36V36c0-19.9-16.1-36-36-36s-36 16.1-36 36v209c0 19.9 16.1 36 36 36zm613 144H768c0-39.8-32.2-72-72-72H200c-39.8 0-72 32.2-72 72v248c0 3.4.2 6.7.7 9.9-.5 7-.7 14-.7 21.1 0 176.7 143.3 320 320 320 160.1 0 292.7-117.5 316.3-271H888c39.8 0 72-32.2 72-72V497c0-39.8-32.2-72-72-72zM696 681h-1.1c.7 7.6 1.1 15.2 1.1 23 0 137-111 248-248 248S200 841 200 704c0-7.8.4-15.4 1.1-23H200V425h496v256zm192-8H776V497h112v176zM613 281c19.9 0 36-16.1 36-36V36c0-19.9-16.1-36-36-36s-36 16.1-36 36v209c0 19.9 16.1 36 36 36zm-170 0c19.9 0 36-16.1 36-36V36c0-19.9-16.1-36-36-36s-36 16.1-36 36v209c0 19.9 16.1 36 36 36z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">coffee</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-copyright">
                <svg viewBox="64 64 896 896" class="" data-icon="copyright" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">copyright</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-trademark">
                <svg viewBox="64 64 896 896" class="" data-icon="trademark" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm87.5-334.7c34.8-12.8 78.4-49 78.4-119.2 0-71.2-45.5-131.1-144.2-131.1H378c-4.4 0-8 3.6-8 8v410c0 4.4 3.6 8 8 8h54.5c4.4 0 8-3.6 8-8V561.2h88.7l74.6 159.2c1.3 2.8 4.1 4.6 7.2 4.6h62a7.9 7.9 0 0 0 7.1-11.5l-80.6-164.2zM522 505h-81.5V357h83.4c48 0 80.9 25.3 80.9 75.5 0 46.9-29.8 72.5-82.8 72.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">trademark</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-safety">
                <svg viewBox="0 0 1024 1024" class="" data-icon="safety" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192L512 64zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110 312 110v330z"></path>
                  <path d="M378.4 475.1a35.91 35.91 0 0 0-50.9 0 35.91 35.91 0 0 0 0 50.9l129.4 129.4 2.1 2.1a33.98 33.98 0 0 0 48.1 0L730.6 434a33.98 33.98 0 0 0 0-48.1l-2.8-2.8a33.98 33.98 0 0 0-48.1 0L483 579.7 378.4 475.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">safety</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-wallet">
                <svg viewBox="64 64 896 896" class="" data-icon="wallet" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 464H528V448h312v128zm0 264H184V184h656v200H496c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32h344v200zM580 512a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">wallet</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-bank">
                <svg viewBox="64 64 896 896" class="" data-icon="bank" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M894 462c30.9 0 43.8-39.7 18.7-58L530.8 126.2a31.81 31.81 0 0 0-37.6 0L111.3 404c-25.1 18.2-12.2 58 18.8 58H192v374h-72c-4.4 0-8 3.6-8 8v52c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-52c0-4.4-3.6-8-8-8h-72V462h62zM512 196.7l271.1 197.2H240.9L512 196.7zM264 462h117v374H264V462zm189 0h117v374H453V462zm307 374H642V462h118v374z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">bank</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-trophy">
                <svg viewBox="64 64 896 896" class="" data-icon="trophy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M868 160h-92v-40c0-4.4-3.6-8-8-8H256c-4.4 0-8 3.6-8 8v40h-92a44 44 0 0 0-44 44v148c0 81.7 60 149.6 138.2 162C265.7 630.2 359 721.7 476 734.5v105.2H280c-17.7 0-32 14.3-32 32V904c0 4.4 3.6 8 8 8h512c4.4 0 8-3.6 8-8v-32.3c0-17.7-14.3-32-32-32H548V734.5C665 721.7 758.3 630.2 773.8 514 852 501.6 912 433.7 912 352V204a44 44 0 0 0-44-44zM184 352V232h64v207.6a91.99 91.99 0 0 1-64-87.6zm520 128c0 49.1-19.1 95.4-53.9 130.1-34.8 34.8-81 53.9-130.1 53.9h-16c-49.1 0-95.4-19.1-130.1-53.9-34.8-34.8-53.9-81-53.9-130.1V184h384v296zm136-128c0 41-26.9 75.8-64 87.6V232h64v120z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">trophy</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-contacts">
                <svg viewBox="64 64 896 896" class="" data-icon="contacts" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M594.3 601.5a111.8 111.8 0 0 0 29.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 0 0-74.6 126.1 8 8 0 0 0 8 8.4H407c4.2 0 7.6-3.3 7.9-7.5 3.8-50.6 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H661a8 8 0 0 0 8-8.4c-2.8-53.3-32-99.7-74.7-126.1zM512 578c-28.5 0-51.7-23.3-51.7-52s23.2-52 51.7-52 51.7 23.3 51.7 52-23.2 52-51.7 52zm416-354H768v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H548v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H328v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H96c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32zm-40 568H136V296h120v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h120v496z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">contacts</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-global">
                <svg viewBox="64 64 896 896" class="" data-icon="global" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8-1.1-1.3-2.1-2.5-3.2-3.7-.4-.5-.8-.9-1.2-1.4l-4.1-4.7-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1-4.8-4.8-.3-.3c-1.5-1.5-3-2.9-4.5-4.3-.5-.5-1-1-1.6-1.5-1-1-2-1.9-3-2.8-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1-1 .9-2 1.9-3 2.9-.5.5-1 1-1.6 1.5-1.5 1.4-3 2.9-4.5 4.3l-.3.3-4.8 4.8-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7-.4.5-.8.9-1.2 1.4-1.1 1.2-2.1 2.5-3.2 3.7-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2 1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6 80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0 0 10-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5 0-.1.1-.1.1-.2 1.4-1.5 2.8-3.1 4.1-4.7.4-.5.8-.9 1.2-1.4a99 99 0 0 0 3.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 0 0-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6 29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 0 1 887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 0 1-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4 3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 0 1 115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 0 1 540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4 21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 0 0 540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4-21.2-16.7-41.7-42.7-59.1-75.1-11-20.6-20.7-43.3-29-67.8 37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 0 1-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8 17.4-32.4 37.8-58.4 59.1-75.1 9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4-23.4 31.3-43.5 70.4-59.2 115.4-21-12-40.9-26-59.4-41.8 31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2 24.9 21.5 52.2 40.3 81.5 55.9-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 0 0-81.5 55.9A373.86 373.86 0 0 1 137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2 18.5-15.8 38.4-29.7 59.4-41.8 15.7 45 35.8 84.1 59.2 115.4-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4 23.4-31.3 43.5-70.4 59.2-115.4 21 12 40.9 26 59.4 41.8a373.81 373.81 0 0 1-107.6 69.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">global</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-shake">
                <svg viewBox="64 64 896 896" class="" data-icon="shake" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M324 666a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm616.7-309.6L667.6 83.2C655.2 70.9 638.7 64 621.1 64s-34.1 6.8-46.5 19.2L83.3 574.5a65.85 65.85 0 0 0 0 93.1l273.2 273.2c12.3 12.3 28.9 19.2 46.5 19.2s34.1-6.8 46.5-19.2l491.3-491.3c25.6-25.7 25.6-67.5-.1-93.1zM403 880.1L143.9 621l477.2-477.2 259 259.2L403 880.1zM152.8 373.7a7.9 7.9 0 0 0 11.2 0L373.7 164a7.9 7.9 0 0 0 0-11.2l-38.4-38.4a7.9 7.9 0 0 0-11.2 0L114.3 323.9a7.9 7.9 0 0 0 0 11.2l38.5 38.6zm718.6 276.6a7.9 7.9 0 0 0-11.2 0L650.3 860.1a7.9 7.9 0 0 0 0 11.2l38.4 38.4a7.9 7.9 0 0 0 11.2 0L909.7 700a7.9 7.9 0 0 0 0-11.2l-38.3-38.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">shake</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-api">
                <svg viewBox="64 64 896 896" class="" data-icon="api" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">api</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fork">
                <svg viewBox="64 64 896 896" class="" data-icon="fork" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M752 100c-61.8 0-112 50.2-112 112 0 47.7 29.9 88.5 72 104.6v27.6L512 601.4 312 344.2v-27.6c42.1-16.1 72-56.9 72-104.6 0-61.8-50.2-112-112-112s-112 50.2-112 112c0 50.6 33.8 93.5 80 107.3v34.4c0 9.7 3.3 19.3 9.3 27L476 672.3v33.6c-44.2 15-76 56.9-76 106.1 0 61.8 50.2 112 112 112s112-50.2 112-112c0-49.2-31.8-91-76-106.1v-33.6l226.7-291.6c6-7.7 9.3-17.3 9.3-27v-34.4c46.2-13.8 80-56.7 80-107.3 0-61.8-50.2-112-112-112zM224 212a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm336 600a48.01 48.01 0 0 1-96 0 48.01 48.01 0 0 1 96 0zm192-552a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fork</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dashboard">
                <svg viewBox="64 64 896 896" class="" data-icon="dashboard" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4 446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96 446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2 55.95 55.95 0 0 0 79.2 0 55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dashboard</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-table">
                <svg viewBox="64 64 896 896" class="" data-icon="table" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 208H676V232h212v136zm0 224H676V432h212v160zM412 432h200v160H412V432zm200-64H412V232h200v136zm-476 64h212v160H136V432zm0-200h212v136H136V232zm0 424h212v136H136V656zm276 0h200v136H412V656zm476 136H676V656h212v136z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">table</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-profile">
                <svg viewBox="64 64 896 896" class="" data-icon="profile" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM340 368a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">profile</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-alert">
                <svg viewBox="64 64 896 896" class="" data-icon="alert" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 0 0-11.3 0l-39.6 39.6a8.03 8.03 0 0 0 0 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-67.9 67.9a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">alert
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-audit">
                <svg viewBox="64 64 896 896" class="" data-icon="audit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M296 250c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm184 144H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-48 458H208V148h560v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm440-88H728v-36.6c46.3-13.8 80-56.6 80-107.4 0-61.9-50.1-112-112-112s-112 50.1-112 112c0 50.7 33.7 93.6 80 107.4V764H520c-8.8 0-16 7.2-16 16v152c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V780c0-8.8-7.2-16-16-16zM646 620c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50zm180 266H566v-60h260v60z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">audit
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-branches">
                <svg viewBox="64 64 896 896" class="" data-icon="branches" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M740 161c-61.8 0-112 50.2-112 112 0 50.1 33.1 92.6 78.5 106.9v95.9L320 602.4V318.1c44.2-15 76-56.9 76-106.1 0-61.8-50.2-112-112-112s-112 50.2-112 112c0 49.2 31.8 91 76 106.1V706c-44.2 15-76 56.9-76 106.1 0 61.8 50.2 112 112 112s112-50.2 112-112c0-49.2-31.8-91-76-106.1v-27.8l423.5-138.7a50.52 50.52 0 0 0 34.9-48.2V378.2c42.9-15.8 73.6-57 73.6-105.2 0-61.8-50.2-112-112-112zm-504 51a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm96 600a48.01 48.01 0 0 1-96 0 48.01 48.01 0 0 1 96 0zm408-491a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">branches
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-build">
                <svg viewBox="64 64 896 896" class="" data-icon="build" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M916 210H376c-17.7 0-32 14.3-32 32v236H108c-17.7 0-32 14.3-32 32v272c0 17.7 14.3 32 32 32h540c17.7 0 32-14.3 32-32V546h236c17.7 0 32-14.3 32-32V242c0-17.7-14.3-32-32-32zm-504 68h200v200H412V278zm-68 468H144V546h200v200zm268 0H412V546h200v200zm268-268H680V278h200v200z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">build
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-border">
                <svg viewBox="64 64 896 896" class="" data-icon="border" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">border
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-crown">
                <svg viewBox="64 64 896 896" class="" data-icon="crown" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M899.6 276.5L705 396.4 518.4 147.5a8.06 8.06 0 0 0-12.9 0L319 396.4 124.3 276.5c-5.7-3.5-13.1 1.2-12.2 7.9L188.5 865c1.1 7.9 7.9 14 16 14h615.1c8 0 14.9-6 15.9-14l76.4-580.6c.8-6.7-6.5-11.4-12.3-7.9zm-126 534.1H250.3l-53.8-409.4 139.8 86.1L512 252.9l175.7 234.4 139.8-86.1-53.9 409.4zM512 509c-62.1 0-112.6 50.5-112.6 112.6S449.9 734.2 512 734.2s112.6-50.5 112.6-112.6S574.1 509 512 509zm0 160.9c-26.6 0-48.2-21.6-48.2-48.3 0-26.6 21.6-48.3 48.2-48.3s48.2 21.6 48.2 48.3c0 26.6-21.6 48.3-48.2 48.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">crown
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-experiment">
                <svg viewBox="64 64 896 896" class="" data-icon="experiment" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 472a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm367 352.9L696.3 352V178H768v-68H256v68h71.7v174L145 824.9c-2.8 7.4-4.3 15.2-4.3 23.1 0 35.3 28.7 64 64 64h614.6c7.9 0 15.7-1.5 23.1-4.3 33-12.7 49.4-49.8 36.6-82.8zM395.7 364.7V180h232.6v184.7L719.2 600c-20.7-5.3-42.1-8-63.9-8-61.2 0-119.2 21.5-165.3 60a188.78 188.78 0 0 1-121.3 43.9c-32.7 0-64.1-8.3-91.8-23.7l118.8-307.5zM210.5 844l41.7-107.8c35.7 18.1 75.4 27.8 116.6 27.8 61.2 0 119.2-21.5 165.3-60 33.9-28.2 76.3-43.9 121.3-43.9 35 0 68.4 9.5 97.6 27.1L813.5 844h-603z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">experiment
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-fire">
                <svg viewBox="64 64 896 896" class="" data-icon="fire" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9zM713 808.5c-53.7 53.2-125 82.4-201 82.4s-147.3-29.2-201-82.4c-53.5-53.1-83-123.5-83-198.4 0-43.5 9.8-85.2 29.1-124 18.8-37.9 46.8-71.8 80.8-97.9a349.6 349.6 0 0 0 58.6-56.8c25-30.5 44.6-64.5 58.2-101a240 240 0 0 0 12.1-46.5c24.1 22.2 44.3 49 61.2 80.4 33.4 62.6 48.8 118.3 45.8 165.7a74.01 74.01 0 0 0 24.4 59.8 73.36 73.36 0 0 0 53.4 18.8c19.7-1 37.8-9.7 51-24.4 13.3-14.9 24.8-30.1 34.4-45.6 14 17.9 25.7 37.4 35 58.4 15.9 35.8 24 73.9 24 113.1 0 74.9-29.5 145.4-83 198.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">fire
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-money-collect">
                <svg viewBox="64 64 896 896" class="" data-icon="money-collect" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M911.5 700.7a8 8 0 0 0-10.3-4.8L840 718.2V180c0-37.6-30.4-68-68-68H252c-37.6 0-68 30.4-68 68v538.2l-61.3-22.3c-.9-.3-1.8-.5-2.7-.5-4.4 0-8 3.6-8 8V763c0 3.3 2.1 6.3 5.3 7.5L501 910.1c7.1 2.6 14.8 2.6 21.9 0l383.8-139.5c3.2-1.2 5.3-4.2 5.3-7.5v-59.6c0-1-.2-1.9-.5-2.8zM512 837.5l-256-93.1V184h512v560.4l-256 93.1zM660.6 312h-54.5c-3 0-5.8 1.7-7.1 4.4l-84.7 168.8H511l-84.7-168.8a8 8 0 0 0-7.1-4.4h-55.7c-1.3 0-2.6.3-3.8 1-3.9 2.1-5.3 7-3.2 10.8l103.9 191.6h-57c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76v39h-76c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76V704c0 4.4 3.6 8 8 8h49.9c4.4 0 8-3.6 8-8v-63.5h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8h-76.3v-39h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8H564l103.7-191.6c.6-1.2 1-2.5 1-3.8-.1-4.3-3.7-7.9-8.1-7.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">money-collect
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-property-safety">
                <svg viewBox="64 64 896 896" class="" data-icon="property-safety" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zM430.5 318h-46c-1.7 0-3.3.4-4.8 1.2a10.1 10.1 0 0 0-4 13.6l88 161.1h-45.2c-5.5 0-10 4.5-10 10v21.3c0 5.5 4.5 10 10 10h63.1v29.7h-63.1c-5.5 0-10 4.5-10 10v21.3c0 5.5 4.5 10 10 10h63.1V658c0 5.5 4.5 10 10 10h41.3c5.5 0 10-4.5 10-10v-51.8h63.4c5.5 0 10-4.5 10-10v-21.3c0-5.5-4.5-10-10-10h-63.4v-29.7h63.4c5.5 0 10-4.5 10-10v-21.3c0-5.5-4.5-10-10-10h-45.7l87.7-161.1a10.05 10.05 0 0 0-8.8-14.8h-45c-3.8 0-7.2 2.1-8.9 5.5l-73.2 144.3-72.9-144.3c-1.7-3.4-5.2-5.5-9-5.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">property-safety
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-read">
                <svg viewBox="64 64 896 896" class="" data-icon="read" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">read
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-reconciliation">
                <svg viewBox="64 64 896 896" class="" data-icon="reconciliation" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M676 565c-50.8 0-92 41.2-92 92s41.2 92 92 92 92-41.2 92-92-41.2-92-92-92zm0 126c-18.8 0-34-15.2-34-34s15.2-34 34-34 34 15.2 34 34-15.2 34-34 34zm204-523H668c0-30.9-25.1-56-56-56h-80c-30.9 0-56 25.1-56 56H264c-17.7 0-32 14.3-32 32v200h-88c-17.7 0-32 14.3-32 32v448c0 17.7 14.3 32 32 32h336c17.7 0 32-14.3 32-32v-16h368c17.7 0 32-14.3 32-32V200c0-17.7-14.3-32-32-32zm-412 64h72v-56h64v56h72v48H468v-48zm-20 616H176V616h272v232zm0-296H176v-88h272v88zm392 240H512V432c0-17.7-14.3-32-32-32H304V240h100v104h336V240h100v552zM704 408v96c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-96c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zM592 512h48c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">reconciliation
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-rest">
                <svg viewBox="64 64 896 896" class="" data-icon="rest" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M508 704c79.5 0 144-64.5 144-144s-64.5-144-144-144-144 64.5-144 144 64.5 144 144 144zm0-224c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80zm324-224h-28.1l-35.7-120.9c-4-13.7-16.5-23.1-30.7-23.1h-451c-14.3 0-26.8 9.4-30.7 23.1L220.1 256H192c-17.7 0-32 14.3-32 32v28c0 4.4 3.6 8 8 8h45.8l47.7 558.7a32 32 0 0 0 31.9 29.3h429.2a32 32 0 0 0 31.9-29.3L802.2 324H856c4.4 0 8-3.6 8-8v-28c0-17.7-14.3-32-32-32zm-518.6-76h397.2l22.4 76H291l22.4-76zm376.2 664H326.4L282 324h451.9l-44.3 520z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">rest
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-security-scan">
                <svg viewBox="64 64 896 896" class="" data-icon="security-scan" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zM402.9 528.8l-77.5 77.5a8.03 8.03 0 0 0 0 11.3l34 34c3.1 3.1 8.2 3.1 11.3 0l77.5-77.5c55.7 35.1 130.1 28.4 178.6-20.1 56.3-56.3 56.3-147.5 0-203.8-56.3-56.3-147.5-56.3-203.8 0-48.5 48.5-55.2 123-20.1 178.6zm65.4-133.3c31.3-31.3 82-31.3 113.2 0 31.3 31.3 31.3 82 0 113.2-31.3 31.3-82 31.3-113.2 0s-31.3-81.9 0-113.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">security-scan
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-insurance">
                <svg viewBox="64 64 896 896" class="" data-icon="insurance" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M441.6 306.8L403 288.6a6.1 6.1 0 0 0-8.4 3.7c-17.5 58.5-45.2 110.1-82.2 153.6a6.05 6.05 0 0 0-1.2 5.6l13.2 43.5c1.3 4.4 7 5.7 10.2 2.4 7.7-8.1 15.4-16.9 23.1-26V656c0 4.4 3.6 8 8 8H403c4.4 0 8-3.6 8-8V393.1a429.2 429.2 0 0 0 33.6-79c1-2.9-.3-6-3-7.3zm26.8 9.2v127.2c0 4.4 3.6 8 8 8h65.9v18.6h-94.9c-4.4 0-8 3.6-8 8v35.6c0 4.4 3.6 8 8 8h55.1c-19.1 30.8-42.4 55.7-71 76a6 6 0 0 0-1.6 8.1l22.8 36.5c1.9 3.1 6.2 3.8 8.9 1.4 31.6-26.8 58.7-62.9 80.6-107.6v120c0 4.4 3.6 8 8 8h36.2c4.4 0 8-3.6 8-8V536c21.3 41.7 47.5 77.5 78.1 106.9 2.6 2.5 6.8 2.1 8.9-.7l26.3-35.3c2-2.7 1.4-6.5-1.2-8.4-30.5-22.6-54.2-47.8-72.3-76.9h59c4.4 0 8-3.6 8-8V478c0-4.4-3.6-8-8-8h-98.8v-18.6h66.7c4.4 0 8-3.6 8-8V316c0-4.4-3.6-8-8-8H476.4c-4.4 0-8 3.6-8 8zm51.5 42.8h97.9v41.6h-97.9v-41.6zm347-188.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">insurance
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-interation">
                <svg viewBox="64 64 896 896" class="" data-icon="interation" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM304.8 524h50.7c3.7 0 6.8-3 6.8-6.8v-78.9c0-19.7 15.9-35.6 35.5-35.6h205.7v53.4c0 5.7 6.5 8.8 10.9 5.3l109.1-85.7c3.5-2.7 3.5-8 0-10.7l-109.1-85.7c-4.4-3.5-10.9-.3-10.9 5.3V338H397.7c-55.1 0-99.7 44.8-99.7 100.1V517c0 4 3 7 6.8 7zm-4.2 134.9l109.1 85.7c4.4 3.5 10.9.3 10.9-5.3v-53.4h205.7c55.1 0 99.7-44.8 99.7-100.1v-78.9c0-3.7-3-6.8-6.8-6.8h-50.7c-3.7 0-6.8 3-6.8 6.8v78.9c0 19.7-15.9 35.6-35.5 35.6H420.6V568c0-5.7-6.5-8.8-10.9-5.3l-109.1 85.7c-3.5 2.5-3.5 7.8 0 10.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">interation
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-safety-certificate">
                <svg viewBox="64 64 896 896" class="" data-icon="safety-certificate" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zm-405.8-201c-3-4.1-7.8-6.6-13-6.6H336c-6.5 0-10.3 7.4-6.5 12.7l126.4 174a16.1 16.1 0 0 0 26 0l212.6-292.7c3.8-5.3 0-12.7-6.5-12.7h-55.2c-5.1 0-10 2.5-13 6.6L468.9 542.4l-64.7-89.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">safety-certificate
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-project">
                <svg viewBox="64 64 896 896" class="" data-icon="project" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M280 752h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8zm192-280h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8zm192 72h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v256c0 4.4 3.6 8 8 8zm216-432H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">project
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-thunderbolt">
                <svg viewBox="64 64 896 896" class="" data-icon="thunderbolt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M848 359.3H627.7L825.8 109c4.1-5.3.4-13-6.3-13H436c-2.8 0-5.5 1.5-6.9 4L170 547.5c-3.1 5.3.7 12 6.9 12h174.4l-89.4 357.6c-1.9 7.8 7.5 13.3 13.3 7.7L853.5 373c5.2-4.9 1.7-13.7-5.5-13.7zM378.2 732.5l60.3-241H281.1l189.6-327.4h224.6L487 427.4h211L378.2 732.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">thunderbolt
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-block">
                <svg viewBox="64 64 896 896" class="" data-icon="block" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M856 376H648V168c0-8.8-7.2-16-16-16H168c-8.8 0-16 7.2-16 16v464c0 8.8 7.2 16 16 16h208v208c0 8.8 7.2 16 16 16h464c8.8 0 16-7.2 16-16V392c0-8.8-7.2-16-16-16zm-480 16v188H220V220h360v156H392c-8.8 0-16 7.2-16 16zm204 52v136H444V444h136zm224 360H444V648h188c8.8 0 16-7.2 16-16V444h156v360z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">block
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-cluster">
                <svg viewBox="64 64 896 896" class="" data-icon="cluster" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888 680h-54V540H546v-92h238c8.8 0 16-7.2 16-16V168c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h238v92H190v140h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8zM256 805.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zm288 0c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM288 384V216h448v168H288zm544 421.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM360 300a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">cluster
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-deployment-unit">
                <svg viewBox="64 64 896 896" class="" data-icon="deployment-unit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M888.3 693.2c-42.5-24.6-94.3-18-129.2 12.8l-53-30.7V523.6c0-15.7-8.4-30.3-22-38.1l-136-78.3v-67.1c44.2-15 76-56.8 76-106.1 0-61.9-50.1-112-112-112s-112 50.1-112 112c0 49.3 31.8 91.1 76 106.1v67.1l-136 78.3c-13.6 7.8-22 22.4-22 38.1v151.6l-53 30.7c-34.9-30.8-86.8-37.4-129.2-12.8-53.5 31-71.7 99.4-41 152.9 30.8 53.5 98.9 71.9 152.2 41 42.5-24.6 62.7-73 53.6-118.8l48.7-28.3 140.6 81c6.8 3.9 14.4 5.9 22 5.9s15.2-2 22-5.9L674.5 740l48.7 28.3c-9.1 45.7 11.2 94.2 53.6 118.8 53.3 30.9 121.5 12.6 152.2-41 30.8-53.6 12.6-122-40.7-152.9zm-673 138.4a47.6 47.6 0 0 1-65.2-17.6c-13.2-22.9-5.4-52.3 17.5-65.5a47.6 47.6 0 0 1 65.2 17.6c13.2 22.9 5.4 52.3-17.5 65.5zM522 463.8zM464 234a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm170 446.2l-122 70.3-122-70.3V539.8l122-70.3 122 70.3v140.4zm239.9 133.9c-13.2 22.9-42.4 30.8-65.2 17.6-22.8-13.2-30.7-42.6-17.5-65.5s42.4-30.8 65.2-17.6c22.9 13.2 30.7 42.5 17.5 65.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">deployment-unit
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dollar">
                <svg viewBox="64 64 896 896" class="" data-icon="dollar" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm47.7-395.2l-25.4-5.9V348.6c38 5.2 61.5 29 65.5 58.2.5 4 3.9 6.9 7.9 6.9h44.9c4.7 0 8.4-4.1 8-8.8-6.1-62.3-57.4-102.3-125.9-109.2V263c0-4.4-3.6-8-8-8h-28.1c-4.4 0-8 3.6-8 8v33c-70.8 6.9-126.2 46-126.2 119 0 67.6 49.8 100.2 102.1 112.7l24.7 6.3v142.7c-44.2-5.9-69-29.5-74.1-61.3-.6-3.8-4-6.6-7.9-6.6H363c-4.7 0-8.4 4-8 8.7 4.5 55 46.2 105.6 135.2 112.1V761c0 4.4 3.6 8 8 8h28.4c4.4 0 8-3.6 8-8.1l-.2-31.7c78.3-6.9 134.3-48.8 134.3-124-.1-69.4-44.2-100.4-109-116.4zm-68.6-16.2c-5.6-1.6-10.3-3.1-15-5-33.8-12.2-49.5-31.9-49.5-57.3 0-36.3 27.5-57 64.5-61.7v124zM534.3 677V543.3c3.1.9 5.9 1.6 8.8 2.2 47.3 14.4 63.2 34.4 63.2 65.1 0 39.1-29.4 62.6-72 66.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dollar
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-euro">
                <svg viewBox="64 64 896 896" class="" data-icon="euro" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm117.7-588.6c-15.9-3.5-34.4-5.4-55.3-5.4-106.7 0-178.9 55.7-198.6 149.9H344c-4.4 0-8 3.6-8 8v27.2c0 4.4 3.6 8 8 8h26.4c-.3 4.1-.3 8.4-.3 12.8v36.9H344c-4.4 0-8 3.6-8 8V568c0 4.4 3.6 8 8 8h30.2c17.2 99.2 90.4 158 200.2 158 20.9 0 39.4-1.7 55.3-5.1 3.7-.8 6.4-4 6.4-7.8v-42.8c0-5-4.6-8.8-9.5-7.8-14.7 2.8-31.9 4.1-51.8 4.1-68.5 0-114.5-36.6-129.8-98.6h130.6c4.4 0 8-3.6 8-8v-27.2c0-4.4-3.6-8-8-8H439.2v-36c0-4.7 0-9.4.3-13.8h135.9c4.4 0 8-3.6 8-8v-27.2c0-4.4-3.6-8-8-8H447.1c17.2-56.9 62.3-90.4 127.6-90.4 19.9 0 37.1 1.5 51.7 4.4a8 8 0 0 0 9.6-7.8v-42.8c0-3.8-2.6-7-6.3-7.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">euro
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-pound">
                <svg viewBox="64 64 896 896" class="" data-icon="pound" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm138-209.8H469.8v-4.7c27.4-17.2 43.9-50.4 43.9-91.1 0-14.1-2.2-27.9-5.3-41H607c4.4 0 8-3.6 8-8v-30c0-4.4-3.6-8-8-8H495c-7.2-22.6-13.4-45.7-13.4-70.5 0-43.5 34-70.2 87.3-70.2 21.5 0 42.5 4.1 60.4 10.5 5.2 1.9 10.6-2 10.6-7.6v-39.5c0-3.3-2.1-6.3-5.2-7.5-18.8-7.2-43.8-12.7-70.3-12.7-92.9 0-151.5 44.5-151.5 120.3 0 26.3 6.9 52 14.6 77.1H374c-4.4 0-8 3.6-8 8v30c0 4.4 3.6 8 8 8h67.1c3.4 14.7 5.9 29.4 5.9 44.2 0 45.2-28.8 83.3-72.8 94.2-3.6.9-6.1 4.1-6.1 7.8V722c0 4.4 3.6 8 8 8H650c4.4 0 8-3.6 8-8v-39.8c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">pound
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-done">
                <svg viewBox="64 64 896 896" class="" data-icon="file-done" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 0 0-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-done
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-exclamation">
                <svg viewBox="64 64 896 896" class="" data-icon="file-exclamation" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM472 744a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm16-104h48c4.4 0 8-3.6 8-8V448c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-exclamation
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-protect">
                <svg viewBox="64 64 896 896" class="" data-icon="file-protect" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M644.7 669.2a7.92 7.92 0 0 0-6.5-3.3H594c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.8-5.3 0-12.7-6.5-12.7h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-22.9-31.9zM688 306v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm184 458H208V148h560v296c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h312c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm402.6-320.8l-192-66.7c-.9-.3-1.7-.4-2.6-.4s-1.8.1-2.6.4l-192 66.7a7.96 7.96 0 0 0-5.4 7.5v251.1c0 2.5 1.1 4.8 3.1 6.3l192 150.2c1.4 1.1 3.2 1.7 4.9 1.7s3.5-.6 4.9-1.7l192-150.2c1.9-1.5 3.1-3.8 3.1-6.3V538.7c0-3.4-2.2-6.4-5.4-7.5zM826 763.7L688 871.6 550 763.7V577l138-48 138 48v186.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-protect
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-search">
                <svg viewBox="64 64 896 896" class="" data-icon="file-search" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm144 452H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm445.7 51.5l-93.3-93.3C814.7 780.7 828 743.9 828 704c0-97.2-78.8-176-176-176s-176 78.8-176 176 78.8 176 176 176c35.8 0 69-10.7 96.8-29l94.7 94.7c1.6 1.6 3.6 2.3 5.6 2.3s4.1-.8 5.6-2.3l31-31a7.9 7.9 0 0 0 0-11.2zM652 816c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-search
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-file-sync">
                <svg viewBox="64 64 896 896" class="" data-icon="file-sync" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M296 256c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm192 200v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8zm-48 396H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm104.1-115.6c1.8-34.5 16.2-66.8 40.8-91.4 26.2-26.2 62-41 99.1-41 37.4 0 72.6 14.6 99.1 41 3.2 3.2 6.3 6.6 9.2 10.1L769.2 673a8 8 0 0 0 3 14.1l93.3 22.5c5 1.2 9.8-2.6 9.9-7.7l.6-95.4a8 8 0 0 0-12.9-6.4l-20.3 15.8C805.4 569.6 748.1 540 684 540c-109.9 0-199.6 86.9-204 195.7-.2 4.5 3.5 8.3 8 8.3h48.1c4.3 0 7.8-3.3 8-7.6zM880 744h-48.1c-4.3 0-7.8 3.3-8 7.6-1.8 34.5-16.2 66.8-40.8 91.4-26.2 26.2-62 41-99.1 41-37.4 0-72.6-14.6-99.1-41-3.2-3.2-6.3-6.6-9.2-10.1l23.1-17.9a8 8 0 0 0-3-14.1l-93.3-22.5c-5-1.2-9.8 2.6-9.9 7.7l-.6 95.4a8 8 0 0 0 12.9 6.4l20.3-15.8C562.6 918.4 619.9 948 684 948c109.9 0 199.6-86.9 204-195.7.2-4.5-3.5-8.3-8-8.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">file-sync
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-gateway">
                <svg viewBox="64 64 896 896" class="" data-icon="gateway" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 392c8.8 0 16-7.2 16-16V192c0-8.8-7.2-16-16-16H744c-8.8 0-16 7.2-16 16v56H296v-56c0-8.8-7.2-16-16-16H96c-8.8 0-16 7.2-16 16v184c0 8.8 7.2 16 16 16h56v240H96c-8.8 0-16 7.2-16 16v184c0 8.8 7.2 16 16 16h184c8.8 0 16-7.2 16-16v-56h432v56c0 8.8 7.2 16 16 16h184c8.8 0 16-7.2 16-16V648c0-8.8-7.2-16-16-16h-56V392h56zM792 240h88v88h-88v-88zm-648 88v-88h88v88h-88zm88 456h-88v-88h88v88zm648-88v88h-88v-88h88zm-80-64h-56c-8.8 0-16 7.2-16 16v56H296v-56c0-8.8-7.2-16-16-16h-56V392h56c8.8 0 16-7.2 16-16v-56h432v56c0 8.8 7.2 16 16 16h56v240z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">gateway
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-gold">
                <svg viewBox="64 64 896 896" class="" data-icon="gold" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M342 472h342c.4 0 .9 0 1.3-.1 4.4-.7 7.3-4.8 6.6-9.2l-40.2-248c-.6-3.9-4-6.7-7.9-6.7H382.2c-3.9 0-7.3 2.8-7.9 6.7l-40.2 248c-.1.4-.1.9-.1 1.3 0 4.4 3.6 8 8 8zm91.2-196h159.5l20.7 128h-201l20.8-128zm2.5 282.7c-.6-3.9-4-6.7-7.9-6.7H166.2c-3.9 0-7.3 2.8-7.9 6.7l-40.2 248c-.1.4-.1.9-.1 1.3 0 4.4 3.6 8 8 8h342c.4 0 .9 0 1.3-.1 4.4-.7 7.3-4.8 6.6-9.2l-40.2-248zM196.5 748l20.7-128h159.5l20.7 128H196.5zm709.4 58.7l-40.2-248c-.6-3.9-4-6.7-7.9-6.7H596.2c-3.9 0-7.3 2.8-7.9 6.7l-40.2 248c-.1.4-.1.9-.1 1.3 0 4.4 3.6 8 8 8h342c.4 0 .9 0 1.3-.1 4.3-.7 7.3-4.8 6.6-9.2zM626.5 748l20.7-128h159.5l20.7 128H626.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">gold
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-robot">
                <svg viewBox="64 64 896 896" class="" data-icon="robot" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M300 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">robot
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-shopping">
                <svg viewBox="64 64 896 896" class="" data-icon="shopping" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M832 312H696v-16c0-101.6-82.4-184-184-184s-184 82.4-184 184v16H192c-17.7 0-32 14.3-32 32v536c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V344c0-17.7-14.3-32-32-32zm-432-16c0-61.9 50.1-112 112-112s112 50.1 112 112v16H400v-16zm392 544H232V384h96v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h224v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h96v456z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">shopping
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>

        
        
        
        
        
        
       
        <h3>品牌和标识</h3>
          <ul class="anticons-list">
            <li class="">
              <i class="anticon anticon-android">
                <svg viewBox="64 64 896 896" class="" data-icon="android" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M448.3 225.2c-18.6 0-32 13.4-32 31.9s13.5 31.9 32 31.9c18.6 0 32-13.4 32-31.9.1-18.4-13.4-31.9-32-31.9zm393.9 96.4c-13.8-13.8-32.7-21.5-53.2-21.5-3.9 0-7.4.4-10.7 1v-1h-3.6c-5.5-30.6-18.6-60.5-38.1-87.4-18.7-25.7-43-47.9-70.8-64.9l25.1-35.8v-3.3c0-.8.4-2.3.7-3.8.6-2.4 1.4-5.5 1.4-8.9 0-18.5-13.5-31.9-32-31.9-9.8 0-19.5 5.7-25.9 15.4l-29.3 42.1c-30-9.8-62.4-15-93.8-15-31.3 0-63.7 5.2-93.8 15L389 79.4c-6.6-9.6-16.1-15.4-26-15.4-18.6 0-32 13.4-32 31.9 0 6.2 2.5 12.8 6.7 17.4l22.6 32.3c-28.7 17-53.5 39.4-72.2 65.1-19.4 26.9-32 56.8-36.7 87.4h-5.5v1c-3.2-.6-6.7-1-10.7-1-20.3 0-39.2 7.5-53.1 21.3-13.8 13.8-21.5 32.6-21.5 53v235c0 20.3 7.5 39.1 21.4 52.9 13.8 13.8 32.8 21.5 53.2 21.5 3.9 0 7.4-.4 10.7-1v93.5c0 29.2 23.9 53.1 53.2 53.1H331v58.3c0 20.3 7.5 39.1 21.4 52.9 13.8 13.8 32.8 21.5 53.2 21.5 20.3 0 39.2-7.5 53.1-21.3 13.8-13.8 21.5-32.6 21.5-53v-58.2H544v58.1c0 20.3 7.5 39.1 21.4 52.9 13.8 13.8 32.8 21.5 53.2 21.5 20.4 0 39.2-7.5 53.1-21.6 13.8-13.8 21.5-32.6 21.5-53v-58.2h31.9c29.3 0 53.2-23.8 53.2-53.1v-91.4c3.2.6 6.7 1 10.7 1 20.3 0 39.2-7.5 53.1-21.3 13.8-13.8 21.5-32.6 21.5-53v-235c-.1-20.3-7.6-39-21.4-52.9zM246 609.6c0 6.8-3.9 10.6-10.7 10.6-6.8 0-10.7-3.8-10.7-10.6V374.5c0-6.8 3.9-10.6 10.7-10.6 6.8 0 10.7 3.8 10.7 10.6v235.1zm131.1-396.8c37.5-27.3 85.3-42.3 135-42.3s97.5 15.1 135 42.5c32.4 23.7 54.2 54.2 62.7 87.5H314.4c8.5-33.4 30.5-64 62.7-87.7zm39.3 674.7c-.6 5.6-4.4 8.7-10.5 8.7-6.8 0-10.7-3.8-10.7-10.6v-58.2h21.2v60.1zm202.3 8.7c-6.8 0-10.7-3.8-10.7-10.6v-58.2h21.2v60.1c-.6 5.6-4.3 8.7-10.5 8.7zm95.8-132.6H309.9V364h404.6v399.6zm85.2-154c0 6.8-3.9 10.6-10.7 10.6-6.8 0-10.7-3.8-10.7-10.6V374.5c0-6.8 3.9-10.6 10.7-10.6 6.8 0 10.7 3.8 10.7 10.6v235.1zM576.1 225.2c-18.6 0-32 13.4-32 31.9s13.5 31.9 32 31.9c18.6 0 32.1-13.4 32.1-32-.1-18.6-13.4-31.8-32.1-31.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">android</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-apple">
                <svg viewBox="64 64 896 896" class="" data-icon="apple" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-10.6 267c-14.3 19.9-28.7 35.6-41.9 45.7-10.5 8-18.6 11.4-24 11.6-9-.1-17.7-2.3-34.7-8.8-1.2-.5-2.5-1-4.2-1.6l-4.4-1.7c-17.4-6.7-27.8-10.3-41.1-13.8-18.6-4.8-37.1-7.4-56.9-7.4-20.2 0-39.2 2.5-58.1 7.2-13.9 3.5-25.6 7.4-42.7 13.8-.7.3-8.1 3.1-10.2 3.9-3.5 1.3-6.2 2.3-8.7 3.2-10.4 3.6-17 5.1-22.9 5.2-.7 0-1.3-.1-1.8-.2-1.1-.2-2.5-.6-4.1-1.3-4.5-1.8-9.9-5.1-16-9.8-14-10.9-29.4-28-45.1-49.9-27.5-38.6-53.5-89.8-66-125.7-15.4-44.8-23-87.7-23-128.6 0-60.2 17.8-106 48.4-137.1 26.3-26.6 61.7-41.5 97.8-42.3 5.9.1 14.5 1.5 25.4 4.5 8.6 2.3 18 5.4 30.7 9.9 3.8 1.4 16.9 6.1 18.5 6.7 7.7 2.8 13.5 4.8 19.2 6.6 18.2 5.8 32.3 9 47.6 9 15.5 0 28.8-3.3 47.7-9.8 7.1-2.4 32.9-12 37.5-13.6 25.6-9.1 44.5-14 60.8-15.2 4.8-.4 9.1-.4 13.2-.1 22.7 1.8 42.1 6.3 58.6 13.8-37.6 43.4-57 96.5-56.9 158.4-.3 14.7.9 31.7 5.1 51.8 6.4 30.5 18.6 60.7 37.9 89 14.7 21.5 32.9 40.9 54.7 57.8-11.5 23.7-25.6 48.2-40.4 68.8zm-94.5-572c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">apple</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-windows">
                <svg viewBox="64 64 896 896" class="" data-icon="windows" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M120.1 770.6L443 823.2V543.8H120.1v226.8zm63.4-163.5h196.2v141.6l-196.2-31.9V607.1zm340.3 226.5l382 62.2v-352h-382v289.8zm63.4-226.5h255.3v214.4l-255.3-41.6V607.1zm-63.4-415.7v288.8h382V128.1l-382 63.3zm318.7 225.5H587.3V245l255.3-42.3v214.2zm-722.4 63.3H443V201.9l-322.9 53.5v224.8zM183.5 309l196.2-32.5v140.4H183.5V309z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">windows</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-ie">
                <svg viewBox="64 64 896 896" class="" data-icon="ie" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M852.6 367.6c16.3-36.9 32.1-90.7 32.1-131.8 0-109.1-119.5-147.6-314.5-57.9-161.4-10.8-316.8 110.5-355.6 279.7 46.3-52.3 117.4-123.4 183-151.7C316.1 378.3 246.7 470 194 565.6c-31.1 56.9-66 148.8-66 217.5 0 147.9 139.3 129.8 270.4 63 47.1 23.1 99.8 23.4 152.5 23.4 145.7 0 276.4-81.4 325.2-219H694.9c-78.8 132.9-295.2 79.5-295.2-71.2h493.2c9.6-65.4-2.5-143.6-40.3-211.7zM224.8 648.3c26.6 76.7 80.6 143.8 150.4 185-133.1 73.4-259.9 43.6-150.4-185zm174-163.3c3-82.7 75.4-142.3 156-142.3 80.1 0 153 59.6 156 142.3h-312zm276.8-281.4c32.1-15.4 72.8-33 108.8-33 47.1 0 81.4 32.6 81.4 80.6 0 30-11.1 73.5-21.9 101.8-39.3-63.5-98.9-122.4-168.3-149.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">ie</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-chrome">
                <svg viewBox="64 64 896 896" class="" data-icon="chrome" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 512.3v-.3c0-229.8-186.2-416-416-416S96 282.2 96 512v.4c0 229.8 186.2 416 416 416s416-186.2 416-416v-.3.2zm-6.7-74.6l.6 3.3-.6-3.3zM676.7 638.2c53.5-82.2 52.5-189.4-11.1-263.7l162.4-8.4c20.5 44.4 32 93.8 32 145.9 0 185.2-144.6 336.6-327.1 347.4l143.8-221.2zM512 652.3c-77.5 0-140.2-62.7-140.2-140.2 0-77.7 62.7-140.2 140.2-140.2S652.2 434.5 652.2 512 589.5 652.3 512 652.3zm369.2-331.7l-3-5.7 3 5.7zM512 164c121.3 0 228.2 62.1 290.4 156.2l-263.6-13.9c-97.5-5.7-190.2 49.2-222.3 141.1L227.8 311c63.1-88.9 166.9-147 284.2-147zM102.5 585.8c26 145 127.1 264 261.6 315.1C229.6 850 128.5 731 102.5 585.8zM164 512c0-55.9 13.2-108.7 36.6-155.5l119.7 235.4c44.1 86.7 137.4 139.7 234 121.6l-74 145.1C302.9 842.5 164 693.5 164 512zm324.7 415.4c4 .2 8 .4 12 .5-4-.2-8-.3-12-.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">chrome</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-github">
                <svg viewBox="64 64 896 896" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">github</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-aliwangwang">
                <svg viewBox="64 64 896 896" class="" data-icon="aliwangwang" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M868.2 377.4c-18.9-45.1-46.3-85.6-81.2-120.6a377.26 377.26 0 0 0-120.5-81.2A375.65 375.65 0 0 0 519 145.8c-41.9 0-82.9 6.7-121.9 20C306 123.3 200.8 120 170.6 120c-2.2 0-7.4 0-9.4.2-11.9.4-22.8 6.5-29.2 16.4-6.5 9.9-7.7 22.4-3.4 33.5l64.3 161.6a378.59 378.59 0 0 0-52.8 193.2c0 51.4 10 101 29.8 147.6 18.9 45 46.2 85.6 81.2 120.5 34.7 34.8 75.4 62.1 120.5 81.2C418.3 894 467.9 904 519 904c51.3 0 100.9-10.1 147.7-29.8 44.9-18.9 85.5-46.3 120.4-81.2 34.7-34.8 62.1-75.4 81.2-120.6a376.5 376.5 0 0 0 29.8-147.6c-.2-51.2-10.1-100.8-29.9-147.4zm-66.4 266.5a307.08 307.08 0 0 1-65.9 98c-28.4 28.5-61.3 50.7-97.7 65.9h-.1c-38 16-78.3 24.2-119.9 24.2a306.51 306.51 0 0 1-217.5-90.2c-28.4-28.5-50.6-61.4-65.8-97.8v-.1c-16-37.8-24.1-78.2-24.1-119.9 0-55.4 14.8-109.7 42.8-157l13.2-22.1-9.5-23.9L206 192c14.9.6 35.9 2.1 59.7 5.6 43.8 6.5 82.5 17.5 114.9 32.6l19 8.9 19.9-6.8c31.5-10.8 64.8-16.2 98.9-16.2a306.51 306.51 0 0 1 217.5 90.2c28.4 28.5 50.6 61.4 65.8 97.8l.1.1.1.1c16 37.6 24.1 78 24.2 119.8-.1 41.7-8.3 82-24.3 119.8zM681.1 364.2c-20.4 0-37.1 16.7-37.1 37.1v55.1c0 20.4 16.6 37.1 37.1 37.1s37.1-16.7 37.1-37.1v-55.1c0-20.5-16.7-37.1-37.1-37.1zm-175.2 0c-20.5 0-37.1 16.7-37.1 37.1v55.1c0 20.4 16.7 37.1 37.1 37.1 20.5 0 37.1-16.7 37.1-37.1v-55.1c0-20.5-16.7-37.1-37.1-37.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">aliwangwang</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dingding">
                <svg viewBox="64 64 896 896" class="" data-icon="dingding" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M573.7 252.5C422.5 197.4 201.3 96.7 201.3 96.7c-15.7-4.1-17.9 11.1-17.9 11.1-5 61.1 33.6 160.5 53.6 182.8 19.9 22.3 319.1 113.7 319.1 113.7S326 357.9 270.5 341.9c-55.6-16-37.9 17.8-37.9 17.8 11.4 61.7 64.9 131.8 107.2 138.4 42.2 6.6 220.1 4 220.1 4s-35.5 4.1-93.2 11.9c-42.7 5.8-97 12.5-111.1 17.8-33.1 12.5 24 62.6 24 62.6 84.7 76.8 129.7 50.5 129.7 50.5 33.3-10.7 61.4-18.5 85.2-24.2L565 743.1h84.6L603 928l205.3-271.9H700.8l22.3-38.7c.3.5.4.8.4.8S799.8 496.1 829 433.8l.6-1h-.1c5-10.8 8.6-19.7 10-25.8 17-71.3-114.5-99.4-265.8-154.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dingding</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-weibo-square">
                <svg viewBox="64 64 896 896" class="" data-icon="weibo-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M433.6 595.1c-14.2-5.9-32.4.2-41.2 13.9-8.8 13.8-4.7 30.2 9.3 36.6 14.3 6.5 33.2.3 42-13.8 8.8-14.3 4.2-30.6-10.1-36.7zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM467.6 736C353.1 736 236 680.4 236 588.9c0-47.8 30.2-103.1 82.3-155.3 69.5-69.6 150.6-101.4 181.1-70.8 13.5 13.5 14.8 36.8 6.1 64.6-4.5 14 13.1 6.3 13.1 6.3 56.2-23.6 105.2-25 123.1.7 9.6 13.7 8.6 32.8-.2 55.1-4.1 10.2 1.3 11.8 9 14.1 31.7 9.8 66.9 33.6 66.9 75.5.2 69.5-99.7 156.9-249.8 156.9zm207.3-290.8a34.9 34.9 0 0 0-7.2-34.1 34.68 34.68 0 0 0-33.1-10.7 18.24 18.24 0 0 1-7.6-35.7c24.1-5.1 50.1 2.3 67.7 21.9 17.7 19.6 22.4 46.3 14.9 69.8a18.13 18.13 0 0 1-22.9 11.7 18.18 18.18 0 0 1-11.8-22.9zm106 34.3s0 .1 0 0a21.1 21.1 0 0 1-26.6 13.7 21.19 21.19 0 0 1-13.6-26.7c11-34.2 4-73.2-21.7-101.8a104.04 104.04 0 0 0-98.9-32.1 21.14 21.14 0 0 1-25.1-16.3 21.07 21.07 0 0 1 16.2-25.1c49.4-10.5 102.8 4.8 139.1 45.1 36.3 40.2 46.1 95.1 30.6 143.2zm-334.5 6.1c-91.4 9-160.7 65.1-154.7 125.2 5.9 60.1 84.8 101.5 176.2 92.5 91.4-9.1 160.7-65.1 154.7-125.3-5.9-60.1-84.8-101.5-176.2-92.4zm80.2 141.7c-18.7 42.3-72.3 64.8-117.8 50.1-43.9-14.2-62.5-57.7-43.3-96.8 18.9-38.4 68-60.1 111.5-48.8 45 11.7 68 54.2 49.6 95.5zm-58.1-46.7c-5.4-2.2-12.2.5-15.4 5.8-3.1 5.4-1.4 11.5 4.1 13.8 5.5 2.3 12.6-.3 15.8-5.8 3-5.6 1-11.8-4.5-13.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">weibo-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-weibo-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="weibo-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-44.4 672C353.1 736 236 680.4 236 588.9c0-47.8 30.2-103.1 82.3-155.3 69.5-69.6 150.6-101.4 181.1-70.8 13.5 13.5 14.8 36.8 6.1 64.6-4.5 14 13.1 6.3 13.1 6.3 56.2-23.6 105.2-25 123.1.7 9.6 13.7 8.6 32.8-.2 55.1-4.1 10.2 1.3 11.8 9 14.1 31.7 9.8 66.9 33.6 66.9 75.5.2 69.5-99.7 156.9-249.8 156.9zm207.3-290.8a34.9 34.9 0 0 0-7.2-34.1 34.68 34.68 0 0 0-33.1-10.7 18.24 18.24 0 0 1-7.6-35.7c24.1-5.1 50.1 2.3 67.7 21.9 17.7 19.6 22.4 46.3 14.9 69.8a18.13 18.13 0 0 1-22.9 11.7 18.18 18.18 0 0 1-11.8-22.9zm106 34.3s0 .1 0 0a21.1 21.1 0 0 1-26.6 13.7 21.19 21.19 0 0 1-13.6-26.7c11-34.2 4-73.2-21.7-101.8a104.04 104.04 0 0 0-98.9-32.1 21.14 21.14 0 0 1-25.1-16.3 21.07 21.07 0 0 1 16.2-25.1c49.4-10.5 102.8 4.8 139.1 45.1 36.3 40.2 46.1 95.1 30.6 143.2zm-334.5 6.1c-91.4 9-160.7 65.1-154.7 125.2 5.9 60.1 84.8 101.5 176.2 92.5 91.4-9.1 160.7-65.1 154.7-125.3-5.9-60.1-84.8-101.5-176.2-92.4zm80.2 141.7c-18.7 42.3-72.3 64.8-117.8 50.1-43.9-14.2-62.5-57.7-43.3-96.8 18.9-38.4 68-60.1 111.5-48.8 45 11.7 68 54.2 49.6 95.5zm-93-32.2c-14.2-5.9-32.4.2-41.2 13.9-8.8 13.8-4.7 30.2 9.3 36.6 14.3 6.5 33.2.3 42-13.8 8.8-14.3 4.2-30.6-10.1-36.7zm34.9-14.5c-5.4-2.2-12.2.5-15.4 5.8-3.1 5.4-1.4 11.5 4.1 13.8 5.5 2.3 12.6-.3 15.8-5.8 3-5.6 1-11.8-4.5-13.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">weibo-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-taobao-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="taobao-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zM315.7 291.5c27.3 0 49.5 22.1 49.5 49.4s-22.1 49.4-49.5 49.4a49.4 49.4 0 1 1 0-98.8zM366.9 578c-13.6 42.3-10.2 26.7-64.4 144.5l-78.5-49s87.7-79.8 105.6-116.2c19.2-38.4-21.1-58.9-21.1-58.9l-60.2-37.5 32.7-50.2c45.4 33.7 48.7 36.6 79.2 67.2 23.8 23.9 20.7 56.8 6.7 100.1zm427.2 55c-15.3 143.8-202.4 90.3-202.4 90.3l10.2-41.1 43.3 9.3c80 5 72.3-64.9 72.3-64.9V423c.6-77.3-72.6-85.4-204.2-38.3l30.6 8.3c-2.5 9-12.5 23.2-25.2 38.6h176v35.6h-99.1v44.5h98.7v35.7h-98.7V622c14.9-4.8 28.6-11.5 40.5-20.5l-8.7-32.5 46.5-14.4 38.8 94.9-57.3 23.9-10.2-37.8c-25.6 19.5-78.8 48-171.8 45.4-99.2 2.6-73.7-112-73.7-112l2.5-1.3H472c-.5 14.7-6.6 38.7 1.7 51.8 6.8 10.8 24.2 12.6 35.3 13.1 1.3.1 2.6.1 3.9.1v-85.3h-101v-35.7h101v-44.5H487c-22.7 24.1-43.5 44.1-43.5 44.1l-30.6-26.7c21.7-22.9 43.3-59.1 56.8-83.2-10.9 4.4-22 9.2-33.6 14.2-11.2 14.3-24.2 29-38.7 43.5.5.8-50-28.4-50-28.4 52.2-44.4 81.4-139.9 81.4-139.9l72.5 20.4s-5.9 14-18.4 35.6c290.3-82.3 307.4 50.5 307.4 50.5s19.1 91.8 3.8 235.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">taobao-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-html5">
                <svg viewBox="64 64 896 896" class="" data-icon="html5" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M145 96l66 746.6L511.8 928l299.6-85.4L878.7 96H145zm610.9 700.6l-244.1 69.6-245.2-69.6-56.7-641.2h603.8l-57.8 641.2zM281 249l1.7 24.3 22.7 253.5h206.5v-.1h112.9l-11.4 118.5L511 672.9v.2h-.8l-102.4-27.7-6.5-73.2h-91l11.3 144.7 188.6 52h1.7v-.4l187.7-51.7 1.7-16.3 21.2-242.2 3.2-24.3H511v.2H389.9l-8.2-94.2h352.1l1.7-19.5 4.8-47.2L742 249H511z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">html5</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-weibo">
                <svg viewBox="64 64 896 896" class="" data-icon="weibo" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M457.3 543c-68.1-17.7-145 16.2-174.6 76.2-30.1 61.2-1 129.1 67.8 151.3 71.2 23 155.2-12.2 184.4-78.3 28.7-64.6-7.2-131-77.6-149.2zm-52 156.2c-13.8 22.1-43.5 31.7-65.8 21.6-22-10-28.5-35.7-14.6-57.2 13.7-21.4 42.3-31 64.4-21.7 22.4 9.5 29.6 35 16 57.3zm45.5-58.5c-5 8.6-16.1 12.7-24.7 9.1-8.5-3.5-11.2-13.1-6.4-21.5 5-8.4 15.6-12.4 24.1-9.1 8.7 3.2 11.8 12.9 7 21.5zm334.5-197.2c15 4.8 31-3.4 35.9-18.3 11.8-36.6 4.4-78.4-23.2-109a111.39 111.39 0 0 0-106-34.3 28.45 28.45 0 0 0-21.9 33.8 28.39 28.39 0 0 0 33.8 21.8c18.4-3.9 38.3 1.8 51.9 16.7a54.2 54.2 0 0 1 11.3 53.3 28.45 28.45 0 0 0 18.2 36zm99.8-206c-56.7-62.9-140.4-86.9-217.7-70.5a32.98 32.98 0 0 0-25.4 39.3 33.12 33.12 0 0 0 39.3 25.5c55-11.7 114.4 5.4 154.8 50.1 40.3 44.7 51.2 105.7 34 159.1-5.6 17.4 3.9 36 21.3 41.7 17.4 5.6 36-3.9 41.6-21.2v-.1c24.1-75.4 8.9-161.1-47.9-223.9zM729 499c-12.2-3.6-20.5-6.1-14.1-22.1 13.8-34.7 15.2-64.7.3-86-28-40.1-104.8-37.9-192.8-1.1 0 0-27.6 12.1-20.6-9.8 13.5-43.5 11.5-79.9-9.6-101-47.7-47.8-174.6 1.8-283.5 110.6C127.3 471.1 80 557.5 80 632.2 80 775.1 263.2 862 442.5 862c235 0 391.3-136.5 391.3-245 0-65.5-55.2-102.6-104.8-118zM443 810.8c-143 14.1-266.5-50.5-275.8-144.5-9.3-93.9 99.2-181.5 242.2-195.6 143-14.2 266.5 50.5 275.8 144.4C694.4 709 586 796.6 443 810.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">weibo</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-twitter">
                <svg viewBox="64 64 896 896" class="" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0 0 75-94 336.64 336.64 0 0 1-108.2 41.2A170.1 170.1 0 0 0 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 0 0-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 0 1-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 0 1-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">twitter</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-wechat">
                <svg viewBox="64 64 896 896" class="" data-icon="wechat" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M690.1 377.4c5.9 0 11.8.2 17.6.5-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6a21.5 21.5 0 0 1 9.1 17.6c0 2.4-.5 4.6-1.1 6.9-5.5 20.3-14.2 52.8-14.6 54.3-.7 2.6-1.7 5.2-1.7 7.9 0 5.9 4.8 10.8 10.8 10.8 2.3 0 4.2-.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5 3.2 0 6.4.5 9.5 1.4 33.1 9.5 68.8 14.8 105.7 14.8 6 0 11.9-.1 17.8-.4-7.1-21-10.9-43.1-10.9-66 0-135.8 132.2-245.8 295.3-245.8zm-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1zm-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1 43.2 19.3 43.2 43.1-19.4 43.1-43.2 43.1zm586.8 415.6c56.9-41.2 93.2-102 93.2-169.7 0-124-120.8-224.5-269.9-224.5-149 0-269.9 100.5-269.9 224.5S540.9 847.5 690 847.5c30.8 0 60.6-4.4 88.1-12.3 2.6-.8 5.2-1.2 7.9-1.2 5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7a9 9 0 0 0 6.4-2.6 9 9 0 0 0 2.6-6.4c0-2.2-.9-4.4-1.4-6.6-.3-1.2-7.6-28.3-12.2-45.3-.5-1.9-.9-3.8-.9-5.7.1-5.9 3.1-11.2 7.6-14.5zM600.2 587.2c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9c0 19.8-16.2 35.9-36 35.9zm179.9 0c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9a36.08 36.08 0 0 1-36 35.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">wechat</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-youtube">
                <svg viewBox="64 64 896 896" class="" data-icon="youtube" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M960 509.2c0-2.2 0-4.7-.1-7.6-.1-8.1-.3-17.2-.5-26.9-.8-27.9-2.2-55.7-4.4-81.9-3-36.1-7.4-66.2-13.4-88.8a139.52 139.52 0 0 0-98.3-98.5c-28.3-7.6-83.7-12.3-161.7-15.2-37.1-1.4-76.8-2.3-116.5-2.8-13.9-.2-26.8-.3-38.4-.4h-29.4c-11.6.1-24.5.2-38.4.4-39.7.5-79.4 1.4-116.5 2.8-78 3-133.5 7.7-161.7 15.2A139.35 139.35 0 0 0 82.4 304C76.3 326.6 72 356.7 69 392.8c-2.2 26.2-3.6 54-4.4 81.9-.3 9.7-.4 18.8-.5 26.9 0 2.9-.1 5.4-.1 7.6v5.6c0 2.2 0 4.7.1 7.6.1 8.1.3 17.2.5 26.9.8 27.9 2.2 55.7 4.4 81.9 3 36.1 7.4 66.2 13.4 88.8 12.8 47.9 50.4 85.7 98.3 98.5 28.2 7.6 83.7 12.3 161.7 15.2 37.1 1.4 76.8 2.3 116.5 2.8 13.9.2 26.8.3 38.4.4h29.4c11.6-.1 24.5-.2 38.4-.4 39.7-.5 79.4-1.4 116.5-2.8 78-3 133.5-7.7 161.7-15.2 47.9-12.8 85.5-50.5 98.3-98.5 6.1-22.6 10.4-52.7 13.4-88.8 2.2-26.2 3.6-54 4.4-81.9.3-9.7.4-18.8.5-26.9 0-2.9.1-5.4.1-7.6v-5.6zm-72 5.2c0 2.1 0 4.4-.1 7.1-.1 7.8-.3 16.4-.5 25.7-.7 26.6-2.1 53.2-4.2 77.9-2.7 32.2-6.5 58.6-11.2 76.3-6.2 23.1-24.4 41.4-47.4 47.5-21 5.6-73.9 10.1-145.8 12.8-36.4 1.4-75.6 2.3-114.7 2.8-13.7.2-26.4.3-37.8.3h-28.6l-37.8-.3c-39.1-.5-78.2-1.4-114.7-2.8-71.9-2.8-124.9-7.2-145.8-12.8-23-6.2-41.2-24.4-47.4-47.5-4.7-17.7-8.5-44.1-11.2-76.3-2.1-24.7-3.4-51.3-4.2-77.9-.3-9.3-.4-18-.5-25.7 0-2.7-.1-5.1-.1-7.1v-4.8c0-2.1 0-4.4.1-7.1.1-7.8.3-16.4.5-25.7.7-26.6 2.1-53.2 4.2-77.9 2.7-32.2 6.5-58.6 11.2-76.3 6.2-23.1 24.4-41.4 47.4-47.5 21-5.6 73.9-10.1 145.8-12.8 36.4-1.4 75.6-2.3 114.7-2.8 13.7-.2 26.4-.3 37.8-.3h28.6l37.8.3c39.1.5 78.2 1.4 114.7 2.8 71.9 2.8 124.9 7.2 145.8 12.8 23 6.2 41.2 24.4 47.4 47.5 4.7 17.7 8.5 44.1 11.2 76.3 2.1 24.7 3.4 51.3 4.2 77.9.3 9.3.4 18 .5 25.7 0 2.7.1 5.1.1 7.1v4.8zM423 646l232-135-232-133z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">youtube</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-alipay-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="alipay-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M308.6 545.7c-19.8 2-57.1 10.7-77.4 28.6-61 53-24.5 150 99 150 71.8 0 143.5-45.7 199.8-119-80.2-38.9-148.1-66.8-221.4-59.6zm460.5 67c100.1 33.4 154.7 43 166.7 44.8A445.9 445.9 0 0 0 960 512c0-247.4-200.6-448-448-448S64 264.6 64 512s200.6 448 448 448c155.9 0 293.2-79.7 373.5-200.5-75.6-29.8-213.6-85-286.8-120.1-69.9 85.7-160.1 137.8-253.7 137.8-158.4 0-212.1-138.1-137.2-229 16.3-19.8 44.2-38.7 87.3-49.4 67.5-16.5 175 10.3 275.7 43.4 18.1-33.3 33.4-69.9 44.7-108.9H305.1V402h160v-56.2H271.3v-31.3h193.8v-80.1s0-13.5 13.7-13.5H557v93.6h191.7v31.3H557.1V402h156.4c-15 61.1-37.7 117.4-66.2 166.8 47.5 17.1 90.1 33.3 121.8 43.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">alipay-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-taobao">
                <svg viewBox="64 64 896 896" class="" data-icon="taobao" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M168.5 273.7a68.7 68.7 0 1 0 137.4 0 68.7 68.7 0 1 0-137.4 0zm730 79.2s-23.7-184.4-426.9-70.1c17.3-30 25.6-49.5 25.6-49.5L396.4 205s-40.6 132.6-113 194.4c0 0 70.1 40.6 69.4 39.4 20.1-20.1 38.2-40.6 53.7-60.4 16.1-7 31.5-13.6 46.7-19.8-18.6 33.5-48.7 83.8-78.8 115.6l42.4 37s28.8-27.7 60.4-61.2h36v61.8H372.9v49.5h140.3v118.5c-1.7 0-3.6 0-5.4-.2-15.4-.7-39.5-3.3-49-18.2-11.5-18.1-3-51.5-2.4-71.9h-97l-3.4 1.8s-35.5 159.1 102.3 155.5c129.1 3.6 203-36 238.6-63.1l14.2 52.6 79.6-33.2-53.9-131.9-64.6 20.1 12.1 45.2c-16.6 12.4-35.6 21.7-56.2 28.4V561.3h137.1v-49.5H628.1V450h137.6v-49.5H521.3c17.6-21.4 31.5-41.1 35-53.6l-42.5-11.6c182.8-65.5 284.5-54.2 283.6 53.2v282.8s10.8 97.1-100.4 90.1l-60.2-12.9-14.2 57.1S882.5 880 903.7 680.2c21.3-200-5.2-327.3-5.2-327.3zm-707.4 18.3l-45.4 69.7 83.6 52.1s56 28.5 29.4 81.9C233.8 625.5 112 736.3 112 736.3l109 68.1c75.4-163.7 70.5-142 89.5-200.7 19.5-60.1 23.7-105.9-9.4-139.1-42.4-42.6-47-46.6-110-93.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">taobao</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-skype">
                <svg viewBox="64 64 896 896" class="" data-icon="skype" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M883.7 578.6c4.1-22.5 6.3-45.5 6.3-68.5 0-51-10-100.5-29.7-147-19-45-46.3-85.4-81-120.1a375.79 375.79 0 0 0-120.1-80.9c-46.6-19.7-96-29.7-147-29.7-24 0-48.1 2.3-71.5 6.8A225.1 225.1 0 0 0 335.6 113c-59.7 0-115.9 23.3-158.1 65.5A222.25 222.25 0 0 0 112 336.6c0 38 9.8 75.4 28.1 108.4-3.7 21.4-5.7 43.3-5.7 65.1 0 51 10 100.5 29.7 147 19 45 46.2 85.4 80.9 120.1 34.7 34.7 75.1 61.9 120.1 80.9 46.6 19.7 96 29.7 147 29.7 22.2 0 44.4-2 66.2-5.9 33.5 18.9 71.3 29 110 29 59.7 0 115.9-23.2 158.1-65.5 42.3-42.2 65.5-98.4 65.5-158.1.1-38-9.7-75.5-28.2-108.7zm-88.1 216C766.9 823.4 729 839 688.4 839c-26.1 0-51.8-6.8-74.6-19.7l-22.5-12.7-25.5 4.5c-17.8 3.2-35.8 4.8-53.6 4.8-41.4 0-81.3-8.1-119.1-24.1-36.3-15.3-69-37.3-97.2-65.5a304.29 304.29 0 0 1-65.5-97.1c-16-37.7-24-77.6-24-119 0-17.4 1.6-35.2 4.6-52.8l4.4-25.1L203 410a151.02 151.02 0 0 1-19.1-73.4c0-40.6 15.7-78.5 44.4-107.2C257.1 200.7 295 185 335.6 185a153 153 0 0 1 71.4 17.9l22.4 11.8 24.8-4.8c18.9-3.6 38.4-5.5 58-5.5 41.4 0 81.3 8.1 119 24 36.5 15.4 69.1 37.4 97.2 65.5 28.2 28.1 50.2 60.8 65.6 97.2 16 37.7 24 77.6 24 119 0 18.4-1.7 37-5.1 55.5l-4.7 25.5 12.6 22.6c12.6 22.5 19.2 48 19.2 73.7 0 40.7-15.7 78.5-44.4 107.2zM583.4 466.2L495 446.6c-33.6-7.7-72.3-17.8-72.3-49.5s27.1-53.9 76.1-53.9c98.7 0 89.7 67.8 138.7 67.8 25.8 0 48.4-15.2 48.4-41.2 0-60.8-97.4-106.5-180-106.5-89.7 0-185.2 38.1-185.2 139.5 0 48.8 17.4 100.8 113.6 124.9l119.4 29.8c36.1 8.9 45.2 29.2 45.2 47.6 0 30.5-30.3 60.3-85.2 60.3-107.2 0-92.3-82.5-149.7-82.5-25.8 0-44.5 17.8-44.5 43.1 0 49.4 60 115.4 194.2 115.4 127.7 0 191-61.5 191-144 0-53.1-24.5-109.6-121.3-131.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">skype</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-qq">
                <svg viewBox="64 64 896 896" class="" data-icon="qq" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">qq</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-medium-workmark">
                <svg viewBox="0 0 1024 1024" class="" data-icon="medium-workmark" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M517.2 590.55c0 3.55 0 4.36 2.4 6.55l13.43 13.25v.57h-59.57v-25.47a41.44 41.44 0 0 1-39.5 27.65c-30.61 0-52.84-24.25-52.84-68.87 0-41.8 23.99-69.69 57.65-69.69a35.15 35.15 0 0 1 34.61 21.67v-56.19a6.99 6.99 0 0 0-2.71-6.79l-12.8-12.45v-.56l59.33-7.04v177.37zm-43.74-8.09v-83.83a22.2 22.2 0 0 0-17.74-8.4c-14.48 0-28.47 13.25-28.47 52.62 0 36.86 12.07 49.88 27.1 49.88a23.91 23.91 0 0 0 19.11-10.27zm83.23 28.46V497.74a7.65 7.65 0 0 0-2.4-6.79l-13.19-13.74v-.57h59.56v114.8c0 3.55 0 4.36 2.4 6.54l13.12 12.45v.57l-59.49-.08zm-2.16-175.67c0-13.4 10.74-24.25 23.99-24.25 13.25 0 23.98 10.86 23.98 24.25 0 13.4-10.73 24.25-23.98 24.25s-23.99-10.85-23.99-24.25zm206.83 155.06c0 3.55 0 4.6 2.4 6.79l13.43 13.25v.57h-59.88V581.9a43.4 43.4 0 0 1-41.01 31.2c-26.55 0-40.78-19.56-40.78-56.59 0-17.86 0-37.43.56-59.41a6.91 6.91 0 0 0-2.4-6.55L620.5 477.2v-.57h59.09v73.81c0 24.25 3.51 40.42 18.54 40.42a23.96 23.96 0 0 0 19.35-12.2v-80.85a7.65 7.65 0 0 0-2.4-6.79l-13.27-13.82v-.57h59.56v113.67zm202.76 20.6c0-4.36.8-59.97.8-72.75 0-24.25-3.76-40.98-20.63-40.98a26.7 26.7 0 0 0-21.19 11.64 99.68 99.68 0 0 1 2.4 23.04c0 16.81-.56 38.23-.8 59.66a6.91 6.91 0 0 0 2.4 6.55l13.43 12.45v.56h-60.12c0-4.04.8-59.98.8-72.76 0-24.65-3.76-40.98-20.39-40.98-8.2.3-15.68 4.8-19.83 11.96v82.46c0 3.56 0 4.37 2.4 6.55l13.11 12.45v.56h-59.48V498.15a7.65 7.65 0 0 0-2.4-6.8l-13.19-14.14v-.57H841v28.78c5.53-19 23.13-31.76 42.7-30.96 19.82 0 33.26 11.16 38.93 32.34a46.41 46.41 0 0 1 44.77-32.34c26.55 0 41.58 19.8 41.58 57.23 0 17.87-.56 38.24-.8 59.66a6.5 6.5 0 0 0 2.72 6.55l13.11 12.45v.57h-59.88zM215.87 593.3l17.66 17.05v.57h-89.62v-.57l17.99-17.05a6.91 6.91 0 0 0 2.4-6.55V477.69c0-4.6 0-10.83.8-16.16L104.66 613.1h-.72l-62.6-139.45c-1.37-3.47-1.77-3.72-2.65-6.06v91.43a32.08 32.08 0 0 0 2.96 17.87l25.19 33.46v.57H0v-.57l25.18-33.55a32.16 32.16 0 0 0 2.96-17.78V457.97A19.71 19.71 0 0 0 24 444.15L6.16 420.78v-.56h63.96l53.56 118.1 47.17-118.1h62.6v.56l-17.58 19.8a6.99 6.99 0 0 0-2.72 6.8v139.37a6.5 6.5 0 0 0 2.72 6.55zm70.11-54.65v.56c0 34.6 17.67 48.5 38.38 48.5 17.29.6 33.29-9.2 40.77-24.97h.56c-7.2 34.2-28.14 50.36-59.48 50.36-33.82 0-65.72-20.61-65.72-68.39 0-50.2 31.98-70.25 67.32-70.25 28.46 0 58.76 13.58 58.76 57.24v6.95h-80.59zm0-6.95h39.42v-7.04c0-35.57-7.28-45.03-18.23-45.03-13.27 0-21.35 14.15-21.35 52.07h.16z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">medium-workmark</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-gitlab">
                <svg viewBox="64 64 896 896" class="" data-icon="gitlab" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M913.9 552.2L805 181.4v-.1c-7.6-22.9-25.7-36.5-48.3-36.5-23.4 0-42.5 13.5-49.7 35.2l-71.4 213H388.8l-71.4-213c-7.2-21.7-26.3-35.2-49.7-35.2-23.1 0-42.5 14.8-48.4 36.6L110.5 552.2c-4.4 14.7 1.2 31.4 13.5 40.7l368.5 276.4c2.6 3.6 6.2 6.3 10.4 7.8l8.6 6.4 8.5-6.4c4.9-1.7 9-4.7 11.9-8.9l368.4-275.4c12.4-9.2 18-25.9 13.6-40.6zM751.7 193.4c1-1.8 2.9-1.9 3.5-1.9 1.1 0 2.5.3 3.4 3L818 394.3H684.5l67.2-200.9zm-487.4 1c.9-2.6 2.3-2.9 3.4-2.9 2.7 0 2.9.1 3.4 1.7l67.3 201.2H206.5l57.8-200zM158.8 558.7l28.2-97.3 202.4 270.2-230.6-172.9zm73.9-116.4h122.1l90.8 284.3-212.9-284.3zM512.9 776L405.7 442.3H620L512.9 776zm157.9-333.7h119.5L580 723.1l90.8-280.8zm-40.7 293.9l207.3-276.7 29.5 99.2-236.8 177.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">gitlab</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-medium">
                <svg viewBox="64 64 896 896" class="" data-icon="medium" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M834.7 279.8l61.3-58.9V208H683.7L532.4 586.4 360.3 208H137.7v12.9l71.6 86.6c7 6.4 10.6 15.8 9.7 25.2V673c2.2 12.3-1.7 24.8-10.3 33.7L128 805v12.7h228.6v-12.9l-80.6-98a39.99 39.99 0 0 1-11.1-33.7V378.7l200.7 439.2h23.3l172.6-439.2v349.9c0 9.2 0 11.1-6 17.2l-62.1 60.3V819h301.2v-12.9l-59.9-58.9c-5.2-4-7.9-10.7-6.8-17.2V297a18.1 18.1 0 0 1 6.8-17.2z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">medium</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-linkedin">
                <svg viewBox="64 64 896 896" class="" data-icon="linkedin" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M847.7 112H176.3c-35.5 0-64.3 28.8-64.3 64.3v671.4c0 35.5 28.8 64.3 64.3 64.3h671.4c35.5 0 64.3-28.8 64.3-64.3V176.3c0-35.5-28.8-64.3-64.3-64.3zm0 736c-447.8-.1-671.7-.2-671.7-.3.1-447.8.2-671.7.3-671.7 447.8.1 671.7.2 671.7.3-.1 447.8-.2 671.7-.3 671.7zM230.6 411.9h118.7v381.8H230.6zm59.4-52.2c37.9 0 68.8-30.8 68.8-68.8a68.8 68.8 0 1 0-137.6 0c-.1 38 30.7 68.8 68.8 68.8zm252.3 245.1c0-49.8 9.5-98 71.2-98 60.8 0 61.7 56.9 61.7 101.2v185.7h118.6V584.3c0-102.8-22.2-181.9-142.3-181.9-57.7 0-96.4 31.7-112.3 61.7h-1.6v-52.2H423.7v381.8h118.6V604.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">linkedin</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-google-plus">
                <svg viewBox="64 64 896 896" class="" data-icon="google-plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M879.5 470.4c-.3-27-.4-54.2-.5-81.3h-80.8c-.3 27-.5 54.1-.7 81.3-27.2.1-54.2.3-81.2.6v80.9c27 .3 54.2.5 81.2.8.3 27 .3 54.1.5 81.1h80.9c.1-27 .3-54.1.5-81.3 27.2-.3 54.2-.4 81.2-.7v-80.9c-26.9-.2-54.1-.2-81.1-.5zm-530 .4c-.1 32.3 0 64.7.1 97 54.2 1.8 108.5 1 162.7 1.8-23.9 120.3-187.4 159.3-273.9 80.7-89-68.9-84.8-220 7.7-284 64.7-51.6 156.6-38.9 221.3 5.8 25.4-23.5 49.2-48.7 72.1-74.7-53.8-42.9-119.8-73.5-190-70.3-146.6-4.9-281.3 123.5-283.7 270.2-9.4 119.9 69.4 237.4 180.6 279.8 110.8 42.7 252.9 13.6 323.7-86 46.7-62.9 56.8-143.9 51.3-220-90.7-.7-181.3-.6-271.9-.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">google-plus</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dropbox">
                <svg viewBox="64 64 896 896" class="" data-icon="dropbox" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M64 556.9l264.2 173.5L512.5 577 246.8 412.7zm896-290.3zm0 0L696.8 95 512.5 248.5l265.2 164.2L512.5 577l184.3 153.4L960 558.8 777.7 412.7zM513 609.8L328.2 763.3l-79.4-51.5v57.8L513 928l263.7-158.4v-57.8l-78.9 51.5zM328.2 95L64 265.1l182.8 147.6 265.7-164.2zM64 556.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dropbox</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-facebook">
                <svg viewBox="64 64 896 896" class="" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-32 736H663.9V602.2h104l15.6-120.7H663.9v-77.1c0-35 9.7-58.8 59.8-58.8h63.9v-108c-11.1-1.5-49-4.8-93.2-4.8-92.2 0-155.3 56.3-155.3 159.6v89H434.9v120.7h104.3V848H176V176h672v672z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">facebook</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-codepen">
                <svg viewBox="64 64 896 896" class="" data-icon="codepen" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M911.7 385.3l-.3-1.5c-.2-1-.3-1.9-.6-2.9-.2-.6-.4-1.1-.5-1.7-.3-.8-.5-1.7-.9-2.5-.2-.6-.5-1.1-.8-1.7-.4-.8-.8-1.5-1.2-2.3-.3-.5-.6-1.1-1-1.6-.8-1.2-1.7-2.4-2.6-3.6-.5-.6-1.1-1.3-1.7-1.9-.4-.5-.9-.9-1.4-1.3-.6-.6-1.3-1.1-1.9-1.6-.5-.4-1-.8-1.6-1.2-.2-.1-.4-.3-.6-.4L531.1 117.8a34.3 34.3 0 0 0-38.1 0L127.3 361.3c-.2.1-.4.3-.6.4-.5.4-1 .8-1.6 1.2-.7.5-1.3 1.1-1.9 1.6-.5.4-.9.9-1.4 1.3-.6.6-1.2 1.2-1.7 1.9-1 1.1-1.8 2.3-2.6 3.6-.3.5-.7 1-1 1.6-.4.7-.8 1.5-1.2 2.3-.3.5-.5 1.1-.8 1.7-.3.8-.6 1.7-.9 2.5-.2.6-.4 1.1-.5 1.7-.2.9-.4 1.9-.6 2.9l-.3 1.5c-.2 1.5-.3 3-.3 4.5v243.5c0 1.5.1 3 .3 4.5l.3 1.5.6 2.9c.2.6.3 1.1.5 1.7.3.9.6 1.7.9 2.5.2.6.5 1.1.8 1.7.4.8.7 1.5 1.2 2.3.3.5.6 1.1 1 1.6.5.7.9 1.4 1.5 2.1l1.2 1.5c.5.6 1.1 1.3 1.7 1.9.4.5.9.9 1.4 1.3.6.6 1.3 1.1 1.9 1.6.5.4 1 .8 1.6 1.2.2.1.4.3.6.4L493 905.7c5.6 3.8 12.3 5.8 19.1 5.8 6.6 0 13.3-1.9 19.1-5.8l365.6-243.5c.2-.1.4-.3.6-.4.5-.4 1-.8 1.6-1.2.7-.5 1.3-1.1 1.9-1.6.5-.4.9-.9 1.4-1.3.6-.6 1.2-1.2 1.7-1.9l1.2-1.5 1.5-2.1c.3-.5.7-1 1-1.6.4-.8.8-1.5 1.2-2.3.3-.5.5-1.1.8-1.7.3-.8.6-1.7.9-2.5.2-.5.4-1.1.5-1.7.3-.9.4-1.9.6-2.9l.3-1.5c.2-1.5.3-3 .3-4.5V389.8c-.3-1.5-.4-3-.6-4.5zM546.4 210.5l269.4 179.4-120.3 80.4-149-99.6V210.5zm-68.8 0v160.2l-149 99.6-120.3-80.4 269.3-179.4zM180.7 454.1l86 57.5-86 57.5v-115zm296.9 358.5L208.3 633.2l120.3-80.4 149 99.6v160.2zM512 592.8l-121.6-81.2L512 430.3l121.6 81.2L512 592.8zm34.4 219.8V652.4l149-99.6 120.3 80.4-269.3 179.4zM843.3 569l-86-57.5 86-57.5v115z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">codepen</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-amazon">
                <svg viewBox="64 64 896 896" class="" data-icon="amazon" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M825 768.9c-3.3-.9-7.3-.4-11.9 1.3-61.6 28.2-121.5 48.3-179.7 60.2C507.7 856 385.2 842.6 266 790.3c-33.1-14.6-79.1-39.2-138-74a9.36 9.36 0 0 0-5.3-2c-2-.1-3.7.1-5.3.9-1.6.8-2.8 1.8-3.7 3.1-.9 1.3-1.1 3.1-.4 5.4.6 2.2 2.1 4.7 4.6 7.4 10.4 12.2 23.3 25.2 38.6 39s35.6 29.4 60.9 46.8c25.3 17.4 51.8 32.9 79.3 46.4 27.6 13.5 59.6 24.9 96.1 34.1s73 13.8 109.4 13.8c36.2 0 71.4-3.7 105.5-10.9 34.2-7.3 63-15.9 86.5-25.9 23.4-9.9 45-21 64.8-33 19.8-12 34.4-22.2 43.9-30.3 9.5-8.2 16.3-14.6 20.2-19.4 4.6-5.7 6.9-10.6 6.9-14.9.1-4.5-1.7-7.1-5-7.9zM527.4 348.1c-15.2 1.3-33.5 4.1-55 8.3-21.5 4.1-41.4 9.3-59.8 15.4s-37.2 14.6-56.3 25.4c-19.2 10.8-35.5 23.2-49 37s-24.5 31.1-33.1 52c-8.6 20.8-12.9 43.7-12.9 68.7 0 27.1 4.7 51.2 14.3 72.5 9.5 21.3 22.2 38 38.2 50.4 15.9 12.4 34 22.1 54 29.2 20 7.1 41.2 10.3 63.2 9.4 22-.9 43.5-4.3 64.4-10.3 20.8-5.9 40.4-15.4 58.6-28.3 18.2-12.9 33.1-28.2 44.8-45.7 4.3 6.6 8.1 11.5 11.5 14.7l8.7 8.9c5.8 5.9 14.7 14.6 26.7 26.1 11.9 11.5 24.1 22.7 36.3 33.7l104.4-99.9-6-4.9c-4.3-3.3-9.4-8-15.2-14.3-5.8-6.2-11.6-13.1-17.2-20.5-5.7-7.4-10.6-16.1-14.7-25.9-4.1-9.8-6.2-19.3-6.2-28.5V258.7c0-10.1-1.9-21-5.7-32.8-3.9-11.7-10.7-24.5-20.7-38.3-10-13.8-22.4-26.2-37.2-37-14.9-10.8-34.7-20-59.6-27.4-24.8-7.4-52.6-11.1-83.2-11.1-31.3 0-60.4 3.7-87.6 10.9-27.1 7.3-50.3 17-69.7 29.2-19.3 12.2-35.9 26.3-49.7 42.4-13.8 16.1-24.1 32.9-30.8 50.4-6.7 17.5-10.1 35.2-10.1 53.1L408 310c5.5-16.4 12.9-30.6 22-42.8 9.2-12.2 17.9-21 25.8-26.5 8-5.5 16.6-9.9 25.7-13.2 9.2-3.3 15.4-5 18.6-5.4 3.2-.3 5.7-.4 7.6-.4 26.7 0 45.2 7.9 55.6 23.6 6.5 9.5 9.7 23.9 9.7 43.3v56.6c-15.2.6-30.4 1.6-45.6 2.9zM573.1 500c0 16.6-2.2 31.7-6.5 45-9.2 29.1-26.7 47.4-52.4 54.8-22.4 6.6-43.7 3.3-63.9-9.8-21.5-14-32.2-33.8-32.2-59.3 0-19.9 5-36.9 15-51.1 10-14.1 23.3-24.7 40-31.7s33-12 49-14.9c15.9-3 33-4.8 51-5.4V500zm335.2 218.9c-4.3-5.4-15.9-8.9-34.9-10.7-19-1.8-35.5-1.7-49.7.4-15.3 1.8-31.1 6.2-47.3 13.4-16.3 7.1-23.4 13.1-21.6 17.8l.7 1.3.9.7 1.4.2h4.6c.8 0 1.8-.1 3.2-.2 1.4-.1 2.7-.3 3.9-.4 1.2-.1 2.9-.3 5.1-.4 2.1-.1 4.1-.4 6-.7.3 0 3.7-.3 10.3-.9 6.6-.6 11.4-1 14.3-1.3 2.9-.3 7.8-.6 14.5-.9 6.7-.3 12.1-.3 16.1 0 4 .3 8.5.7 13.6 1.1 5.1.4 9.2 1.3 12.4 2.7 3.2 1.3 5.6 3 7.1 5.1 5.2 6.6 4.2 21.2-3 43.9s-14 40.8-20.4 54.2c-2.8 5.7-2.8 9.2 0 10.7s6.7.1 11.9-4c15.6-12.2 28.6-30.6 39.1-55.3 6.1-14.6 10.5-29.8 13.1-45.7 2.4-15.9 2-26.2-1.3-31z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">amazon</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-google">
                <svg viewBox="64 64 896 896" class="" data-icon="google" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">google</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-codepen-circle">
                <svg viewBox="64 64 896 896" class="" data-icon="codepen-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M488.1 414.7V303.4L300.9 428l83.6 55.8zm254.1 137.7v-79.8l-59.8 39.9zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm278 533c0 1.1-.1 2.1-.2 3.1 0 .4-.1.7-.2 1a14.16 14.16 0 0 1-.8 3.2c-.2.6-.4 1.2-.6 1.7-.2.4-.4.8-.5 1.2-.3.5-.5 1.1-.8 1.6-.2.4-.4.7-.7 1.1-.3.5-.7 1-1 1.5-.3.4-.5.7-.8 1-.4.4-.8.9-1.2 1.3-.3.3-.6.6-1 .9-.4.4-.9.8-1.4 1.1-.4.3-.7.6-1.1.8-.1.1-.3.2-.4.3L525.2 786c-4 2.7-8.6 4-13.2 4-4.7 0-9.3-1.4-13.3-4L244.6 616.9c-.1-.1-.3-.2-.4-.3l-1.1-.8c-.5-.4-.9-.7-1.3-1.1-.3-.3-.6-.6-1-.9-.4-.4-.8-.8-1.2-1.3a7 7 0 0 1-.8-1c-.4-.5-.7-1-1-1.5-.2-.4-.5-.7-.7-1.1-.3-.5-.6-1.1-.8-1.6-.2-.4-.4-.8-.5-1.2-.2-.6-.4-1.2-.6-1.7-.1-.4-.3-.8-.4-1.2-.2-.7-.3-1.3-.4-2-.1-.3-.1-.7-.2-1-.1-1-.2-2.1-.2-3.1V427.9c0-1 .1-2.1.2-3.1.1-.3.1-.7.2-1a14.16 14.16 0 0 1 .8-3.2c.2-.6.4-1.2.6-1.7.2-.4.4-.8.5-1.2.2-.5.5-1.1.8-1.6.2-.4.4-.7.7-1.1.6-.9 1.2-1.7 1.8-2.5.4-.4.8-.9 1.2-1.3.3-.3.6-.6 1-.9.4-.4.9-.8 1.3-1.1.4-.3.7-.6 1.1-.8.1-.1.3-.2.4-.3L498.7 239c8-5.3 18.5-5.3 26.5 0l254.1 169.1c.1.1.3.2.4.3l1.1.8 1.4 1.1c.3.3.6.6 1 .9.4.4.8.8 1.2 1.3.7.8 1.3 1.6 1.8 2.5.2.4.5.7.7 1.1.3.5.6 1 .8 1.6.2.4.4.8.5 1.2.2.6.4 1.2.6 1.7.1.4.3.8.4 1.2.2.7.3 1.3.4 2 .1.3.1.7.2 1 .1 1 .2 2.1.2 3.1V597zm-254.1 13.3v111.3L723.1 597l-83.6-55.8zM281.8 472.6v79.8l59.8-39.9zM512 456.1l-84.5 56.4 84.5 56.4 84.5-56.4zM723.1 428L535.9 303.4v111.3l103.6 69.1zM384.5 541.2L300.9 597l187.2 124.6V610.3l-103.6-69.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">codepen-circle</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-alipay">
                <svg viewBox="64 64 896 896" class="" data-icon="alipay" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M789 610.3c-38.7-12.9-90.7-32.7-148.5-53.6 34.8-60.3 62.5-129 80.7-203.6H530.5v-68.6h233.6v-38.3H530.5V132h-95.4c-16.7 0-16.7 16.5-16.7 16.5v97.8H182.2v38.3h236.3v68.6H223.4v38.3h378.4a667.18 667.18 0 0 1-54.5 132.9c-122.8-40.4-253.8-73.2-336.1-53-52.6 13-86.5 36.1-106.5 60.3-91.4 111-25.9 279.6 167.2 279.6C386 811.2 496 747.6 581.2 643 708.3 704 960 808.7 960 808.7V659.4s-31.6-2.5-171-49.1zM253.9 746.6c-150.5 0-195-118.3-120.6-183.1 24.8-21.9 70.2-32.6 94.4-35 89.4-8.8 172.2 25.2 269.9 72.8-68.8 89.5-156.3 145.3-243.7 145.3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">alipay</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-ant-design">
                <svg viewBox="64 64 896 896" class="" data-icon="ant-design" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M716.3 313.8c19-18.9 19-49.7 0-68.6l-69.9-69.9.1.1c-18.5-18.5-50.3-50.3-95.3-95.2-21.2-20.7-55.5-20.5-76.5.5L80.9 474.2a53.84 53.84 0 0 0 0 76.4L474.6 944a54.14 54.14 0 0 0 76.5 0l165.1-165c19-18.9 19-49.7 0-68.6a48.7 48.7 0 0 0-68.7 0l-125 125.2c-5.2 5.2-13.3 5.2-18.5 0L189.5 521.4c-5.2-5.2-5.2-13.3 0-18.5l314.4-314.2c.4-.4.9-.7 1.3-1.1 5.2-4.1 12.4-3.7 17.2 1.1l125.2 125.1c19 19 49.8 19 68.7 0zM408.6 514.4a106.3 106.2 0 1 0 212.6 0 106.3 106.2 0 1 0-212.6 0zm536.2-38.6L821.9 353.5c-19-18.9-49.8-18.9-68.7.1a48.4 48.4 0 0 0 0 68.6l83 82.9c5.2 5.2 5.2 13.3 0 18.5l-81.8 81.7a48.4 48.4 0 0 0 0 68.6 48.7 48.7 0 0 0 68.7 0l121.8-121.7a53.93 53.93 0 0 0-.1-76.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">ant-design</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-aliyun">
                <svg viewBox="64 64 896 896" class="" data-icon="aliyun" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M959.2 383.9c-.3-82.1-66.9-148.6-149.1-148.6H575.9l21.6 85.2 201 43.7a42.58 42.58 0 0 1 32.9 39.7c.1.5.1 216.1 0 216.6a42.58 42.58 0 0 1-32.9 39.7l-201 43.7-21.6 85.3h234.2c82.1 0 148.8-66.5 149.1-148.6V383.9zM225.5 660.4a42.58 42.58 0 0 1-32.9-39.7c-.1-.6-.1-216.1 0-216.6.8-19.4 14.6-35.5 32.9-39.7l201-43.7 21.6-85.2H213.8c-82.1 0-148.8 66.4-149.1 148.6V641c.3 82.1 67 148.6 149.1 148.6H448l-21.6-85.3-200.9-43.9zm200.9-158.8h171v21.3h-171z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">aliyun</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-zhihu">
                <svg viewBox="64 64 896 896" class="" data-icon="zhihu" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M564.7 230.1V803h60l25.2 71.4L756.3 803h131.5V230.1H564.7zm247.7 497h-59.9l-75.1 50.4-17.8-50.4h-18V308.3h170.7v418.8zM526.1 486.9H393.3c2.1-44.9 4.3-104.3 6.6-172.9h130.9l-.1-8.1c0-.6-.2-14.7-2.3-29.1-2.1-15-6.6-34.9-21-34.9H287.8c4.4-20.6 15.7-69.7 29.4-93.8l6.4-11.2-12.9-.7c-.8 0-19.6-.9-41.4 10.6-35.7 19-51.7 56.4-58.7 84.4-18.4 73.1-44.6 123.9-55.7 145.6-3.3 6.4-5.3 10.2-6.2 12.8-1.8 4.9-.8 9.8 2.8 13 10.5 9.5 38.2-2.9 38.5-3 .6-.3 1.3-.6 2.2-1 13.9-6.3 55.1-25 69.8-84.5h56.7c.7 32.2 3.1 138.4 2.9 172.9h-141l-2.1 1.5c-23.1 16.9-30.5 63.2-30.8 65.2l-1.4 9.2h167c-12.3 78.3-26.5 113.4-34 127.4-3.7 7-7.3 14-10.7 20.8-21.3 42.2-43.4 85.8-126.3 153.6-3.6 2.8-7 8-4.8 13.7 2.4 6.3 9.3 9.1 24.6 9.1 5.4 0 11.8-.3 19.4-1 49.9-4.4 100.8-18 135.1-87.6 17-35.1 31.7-71.7 43.9-108.9L497 850l5-12c.8-1.9 19-46.3 5.1-95.9l-.5-1.8-108.1-123-22 16.6c6.4-26.1 10.6-49.9 12.5-71.1h158.7v-8c0-40.1-18.5-63.9-19.2-64.9l-2.4-3z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">zhihu</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-slack">
                <svg viewBox="64 64 896 896" class="" data-icon="slack" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M925.5 541.9a71.49 71.49 0 0 0-90.1-45.9l-80 26L703 360.9l80-26a71.49 71.49 0 0 0 45.9-90.1 71.49 71.49 0 0 0-90.1-45.9l-80 26-26.2-80.6a71.49 71.49 0 1 0-136 44.2l26.2 80.6-161.1 52.4-26.2-80.6a71.49 71.49 0 1 0-136 44.2l26.2 80.6-81.1 26.4a71.49 71.49 0 0 0-45.9 90.1 71.49 71.49 0 0 0 90.1 45.9l81.1-26.4 52.4 161.1-81.3 26.3a71.49 71.49 0 0 0-45.9 90.1 71.49 71.49 0 0 0 90.1 45.9l81.1-26.4 26.2 80.6a71.49 71.49 0 0 0 90.1 45.9 71.49 71.49 0 0 0 45.9-90.1l-26.2-80.6 161.1-52.4 26.2 80.6a71.49 71.49 0 0 0 90.1 45.9 71.49 71.49 0 0 0 45.9-90.1l-26-80.5 80-26c37.5-12.1 58.1-52.5 45.9-90.1zm-467.3 76.7l-52.4-161.1L567 405.1l52.4 161.1-161.2 52.4z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">slack</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-slack-square">
                <svg viewBox="64 64 896 896" class="" data-icon="slack-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M893.1 397.6c-85.8-286-209.5-352.5-495.5-266.7S45.1 340.4 130.9 626.4s209.5 352.5 495.5 266.7 352.5-209.5 266.7-495.5zm-150 189.9l-50.3 16.3 16.5 50.6c7.7 23.6-5.3 49-28.9 56.7-23.6 7.7-49-5.3-56.7-28.9l-16.5-50.6L506 664.5l16.5 50.6c7.7 23.6-5.3 49-28.9 56.7-23.6 7.7-49-5.3-56.7-28.9l-16.5-50.6-51 16.6c-23.6 7.7-49-5.3-56.7-28.9s5.3-49 28.9-56.7l51-16.6-32.9-101.3-51 16.6c-23.6 7.7-49-5.3-56.7-28.9-7.7-23.6 5.3-49 28.9-56.7l51-16.6-16.5-50.6c-7.7-23.6 5.3-49 28.9-56.7 23.6-7.7 49 5.3 56.7 28.9l16.5 50.6 101.3-32.9-16.5-50.6c-7.7-23.6 5.3-49 28.9-56.7s49 5.3 56.7 28.9l16.5 50.6 50.3-16.3c23.6-7.7 49 5.3 56.7 28.9 7.7 23.6-5.3 49-28.9 56.7L632.1 417 665 518.3l50.3-16.3c23.6-7.7 49 5.3 56.7 28.9 7.7 23.6-5.3 48.9-28.9 56.6zM445.26 477.67l101.3-32.9 32.9 101.29-101.29 32.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">slack-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-behance">
                <svg viewBox="64 64 896 896" class="" data-icon="behance" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M634 294.3h199.5v48.4H634zM434.1 485.8c44.1-21.1 67.2-53.2 67.2-102.8 0-98.1-73-121.9-157.3-121.9H112v492.4h238.5c89.4 0 173.3-43 173.3-143 0-61.8-29.2-107.5-89.7-124.7zM220.2 345.1h101.5c39.1 0 74.2 10.9 74.2 56.3 0 41.8-27.3 58.6-66 58.6H220.2V345.1zm115.5 324.8H220.1V534.3H338c47.6 0 77.7 19.9 77.7 70.3 0 49.6-35.9 65.3-80 65.3zm575.8-89.5c0-105.5-61.7-193.4-173.3-193.4-108.5 0-182.3 81.7-182.3 188.8 0 111 69.9 187.2 182.3 187.2 85.1 0 140.2-38.3 166.7-120h-86.3c-9.4 30.5-47.6 46.5-77.3 46.5-57.4 0-87.4-33.6-87.4-90.7h256.9c.3-5.9.7-12.1.7-18.4zM653.9 537c3.1-46.9 34.4-76.2 81.2-76.2 49.2 0 73.8 28.9 78.1 76.2H653.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">behance</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-behance-square">
                <svg viewBox="64 64 896 896" class="" data-icon="behance-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM598.5 350.9h138.4v33.7H598.5v-33.7zM512 628.8a89.52 89.52 0 0 1-27 31c-11.8 8.2-24.9 14.2-38.8 17.7a167.4 167.4 0 0 1-44.6 5.7H236V342.1h161c16.3 0 31.1 1.5 44.6 4.3 13.4 2.8 24.8 7.6 34.4 14.1 9.5 6.5 17 15.2 22.3 26 5.2 10.7 7.9 24.1 7.9 40 0 17.2-3.9 31.4-11.7 42.9-7.9 11.5-19.3 20.8-34.8 28.1 21.1 6 36.6 16.7 46.8 31.7 10.4 15.2 15.5 33.4 15.5 54.8 0 17.4-3.3 32.3-10 44.8zM790.8 576H612.4c0 19.4 6.7 38 16.8 48 10.2 9.9 24.8 14.9 43.9 14.9 13.8 0 25.5-3.5 35.5-10.4 9.9-6.9 15.9-14.2 18.1-21.8h59.8c-9.6 29.7-24.2 50.9-44 63.7-19.6 12.8-43.6 19.2-71.5 19.2-19.5 0-37-3.2-52.7-9.3-15.1-5.9-28.7-14.9-39.9-26.5a121.2 121.2 0 0 1-25.1-41.2c-6.1-16.9-9.1-34.7-8.9-52.6 0-18.5 3.1-35.7 9.1-51.7 11.5-31.1 35.4-56 65.9-68.9 16.3-6.8 33.8-10.2 51.5-10 21 0 39.2 4 55 12.2a111.6 111.6 0 0 1 38.6 32.8c10.1 13.7 17.2 29.3 21.7 46.9 4.3 17.3 5.8 35.5 4.6 54.7zm-122-95.6c-10.8 0-19.9 1.9-26.9 5.6-7 3.7-12.8 8.3-17.2 13.6a48.4 48.4 0 0 0-9.1 17.4c-1.6 5.3-2.7 10.7-3.1 16.2H723c-1.6-17.3-7.6-30.1-15.6-39.1-8.4-8.9-21.9-13.7-38.6-13.7zm-248.5-10.1c8.7-6.3 12.9-16.7 12.9-31 .3-6.8-1.1-13.5-4.1-19.6-2.7-4.9-6.7-9-11.6-11.9a44.8 44.8 0 0 0-16.6-6c-6.4-1.2-12.9-1.8-19.3-1.7h-70.3v79.7h76.1c13.1.1 24.2-3.1 32.9-9.5zm11.8 72c-9.8-7.5-22.9-11.2-39.2-11.2h-81.8v94h80.2c7.5 0 14.4-.7 21.1-2.1s12.7-3.8 17.8-7.2c5.1-3.3 9.2-7.8 12.3-13.6 3-5.8 4.5-13.2 4.5-22.1 0-17.7-5-30.2-14.9-37.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">behance-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dribbble">
                <svg viewBox="64 64 896 896" class="" data-icon="dribbble" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 96C282.6 96 96 282.6 96 512s186.6 416 416 416 416-186.6 416-416S741.4 96 512 96zm275.1 191.8c49.5 60.5 79.5 137.5 80.2 221.4-11.7-2.5-129.2-26.3-247.4-11.4-2.5-6.1-5-12.2-7.6-18.3-7.4-17.3-15.3-34.6-23.6-51.5C720 374.3 779.6 298 787.1 287.8zM512 157.2c90.3 0 172.8 33.9 235.5 89.5-6.4 9.1-59.9 81-186.2 128.4-58.2-107-122.7-194.8-132.6-208 27.3-6.6 55.2-9.9 83.3-9.9zM360.9 191c9.4 12.8 72.9 100.9 131.7 205.5C326.4 440.6 180 440 164.1 439.8c23.1-110.3 97.4-201.9 196.8-248.8zM156.7 512.5c0-3.6.1-7.3.2-10.9 15.5.3 187.7 2.5 365.2-50.6 10.2 19.9 19.9 40.1 28.8 60.3-4.7 1.3-9.4 2.7-14 4.2C353.6 574.9 256.1 736.4 248 750.1c-56.7-63-91.3-146.3-91.3-237.6zM512 867.8c-82.2 0-157.9-28-218.1-75 6.4-13.1 78.3-152 278.7-221.9l2.3-.8c49.9 129.6 70.5 238.3 75.8 269.5A350.46 350.46 0 0 1 512 867.8zm198.5-60.7c-3.6-21.6-22.5-125.6-69-253.3C752.9 536 850.7 565.2 862.8 569c-15.8 98.8-72.5 184.2-152.3 238.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dribbble</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-dribbble-square">
                <svg viewBox="64 64 896 896" class="" data-icon="dribbble-square" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M498.6 432c-40.8-72.5-84.7-133.4-91.2-142.3-68.8 32.5-120.3 95.9-136.2 172.2 11 .2 112.4.7 227.4-29.9zm66.5 21.8c5.7 11.7 11.2 23.6 16.3 35.6 1.8 4.2 3.6 8.4 5.3 12.7 81.8-10.3 163.2 6.2 171.3 7.9-.5-58.1-21.3-111.4-55.5-153.3-5.3 7.1-46.5 60-137.4 97.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM512 800c-158.8 0-288-129.2-288-288s129.2-288 288-288 288 129.2 288 288-129.2 288-288 288zm89.7-259.1c32.2 88.4 45.3 160.4 47.8 175.4 55.2-37.3 94.5-96.4 105.4-164.9-8.4-2.6-76.1-22.8-153.2-10.5zm-72.5-26.4c3.2-1 6.4-2 9.7-2.9-6.2-14-12.9-28-19.9-41.7-122.8 36.8-242.1 35.2-252.8 35-.1 2.5-.1 5-.1 7.5 0 63.2 23.9 120.9 63.2 164.5 5.5-9.6 73-121.4 199.9-162.4zm145.9-186.2a245.2 245.2 0 0 0-220.8-55.1c6.8 9.1 51.5 69.9 91.8 144 87.5-32.8 124.5-82.6 129-88.9zM554 552.8c-138.7 48.3-188.6 144.6-193 153.6 41.7 32.5 94.1 51.9 151 51.9 34.1 0 66.6-6.9 96.1-19.5-3.7-21.6-17.9-96.8-52.5-186.6l-1.6.6z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">dribbble-square</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-instagram">
                <svg viewBox="64 64 896 896" class="" data-icon="instagram" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 0 0-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">instagram</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-yuque">
                <svg viewBox="64 64 896 896" class="" data-icon="yuque" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M854.6 370.6c-9.9-39.4 9.9-102.2 73.4-124.4l-67.9-3.6s-25.7-90-143.6-98c-117.8-8.1-194.9-3-195-3 .1 0 87.4 55.6 52.4 154.7-25.6 52.5-65.8 95.6-108.8 144.7-1.3 1.3-2.5 2.6-3.5 3.7C319.4 605 96 860 96 860c245.9 64.4 410.7-6.3 508.2-91.1 20.5-.2 35.9-.3 46.3-.3 135.8 0 250.6-117.6 245.9-248.4-3.2-89.9-31.9-110.2-41.8-149.6zm-204.1 334c-10.6 0-26.2.1-46.8.3l-23.6.2-17.8 15.5c-47.1 41-104.4 71.5-171.4 87.6-52.5 12.6-110 16.2-172.7 9.6 18-20.5 36.5-41.6 55.4-63.1 92-104.6 173.8-197.5 236.9-268.5l1.4-1.4 1.3-1.5c4.1-4.6 20.6-23.3 24.7-28.1 9.7-11.1 17.3-19.9 24.5-28.6 30.7-36.7 52.2-67.8 69-102.2l1.6-3.3 1.2-3.4c13.7-38.8 15.4-76.9 6.2-112.8 22.5.7 46.5 1.9 71.7 3.6 33.3 2.3 55.5 12.9 71.1 29.2 5.8 6 10.2 12.5 13.4 18.7 1 2 1.7 3.6 2.3 5l5 17.7c-15.7 34.5-19.9 73.3-11.4 107.2 3 11.8 6.9 22.4 12.3 34.4 2.1 4.7 9.5 20.1 11 23.3 10.3 22.7 15.4 43 16.7 78.7 3.3 94.6-82.7 181.9-182 181.9z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">yuque</span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-alibaba">
                <svg viewBox="64 64 896 896" class="" data-icon="alibaba" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M602.9 669.8c-37.2 2.6-33.6-17.3-11.5-46.2 50.4-67.2 143.7-158.5 147.9-225.2 5.8-86.6-81.3-113.4-171-113.4-62.4 1.6-127 18.9-171 34.6-151.6 53.5-246.6 137.5-306.9 232-62.4 93.4-43 183.2 91.8 185.8 101.8-4.2 170.5-32.5 239.7-68.2.5 0-192.5 55.1-263.9 14.7-7.9-4.2-15.7-10-17.8-26.2 0-33.1 54.6-67.7 86.6-78.7v-56.7c64.5 22.6 140.6 16.3 205.7-32 2.1 5.8 4.2 13.1 3.7 21h11c2.6-22.6-12.6-44.6-37.8-46.2 7.3 5.8 12.6 10.5 15.2 14.7l-1 1-.5.5c-83.9 58.8-165.3 31.5-173.1 29.9l46.7-45.7-13.1-33.1c92.9-32.5 169.5-56.2 296.9-78.7l-28.5-23 14.7-8.9c75.5 21 126.4 36.7 123.8 76.6-1 6.8-3.7 14.7-7.9 23.1C660.1 466.1 594 538 567.2 569c-17.3 20.5-34.6 39.4-46.7 58.3-13.6 19.4-20.5 37.3-21 53.5 2.6 131.8 391.4-61.9 468-112.9-111.7 47.8-232.9 93.5-364.6 101.9zm85-302.9c2.8 5.2 4.1 11.6 4.1 19.1-.1-6.8-1.4-13.3-4.1-19.1z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">alibaba
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
            <li class="">
              <i class="anticon anticon-yahoo">
                <svg viewBox="64 64 896 896" class="" data-icon="yahoo" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M859.9 681.4h-14.1c-27.1 0-49.2 22.2-49.2 49.3v14.1c0 27.1 22.2 49.3 49.2 49.3h14.1c27.1 0 49.2-22.2 49.2-49.3v-14.1c0-27.1-22.2-49.3-49.2-49.3zM402.6 231C216.2 231 65 357 65 512.5S216.2 794 402.6 794s337.6-126 337.6-281.5S589.1 231 402.6 231zm0 507C245.1 738 121 634.6 121 512.5c0-62.3 32.3-119.7 84.9-161v48.4h37l159.8 159.9v65.3h-84.4v56.3h225.1v-56.3H459v-65.3l103.5-103.6h65.3v-56.3H459v65.3l-28.1 28.1-93.4-93.5h37v-56.3H216.4c49.4-35 114.3-56.6 186.2-56.6 157.6 0 281.6 103.4 281.6 225.5S560.2 738 402.6 738zm534.7-507H824.7c-15.5 0-27.7 12.6-27.1 28.1l13.1 366h84.4l65.4-366.4c2.7-15.2-7.8-27.7-23.2-27.7z"></path>
                </svg>
              </i>
              <span class="anticon-class">
                <span class="ant-badge">yahoo
                  <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
                </span>
              </span>
            </li>
          </ul>
      </div>
    );
  }
}

export default IconSelect;