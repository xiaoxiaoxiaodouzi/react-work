import React from 'react'
import './index.css'

// eslint-disable-next-line

class IconSelect extends React.Component {
  componentDidMount(){
    let th=this;
    var ul = document.getElementsByClassName('anticons-list');
    //var li=ul[0].getElementsByTagName('li')
    for(var j=0;j<ul.length;j++){
        //使用（IIFE）立即执行函数给每一个li都添加上click事件
        //也可以用ul[Counts].childNods来获取里面的li
      (function(counts){
        var li=ul[counts].getElementsByTagName('li');
        for(var i=0;i<li.length;i++){
          // eslint-disable-next-line
          (function (Index) {
            li[i].onclick = (e => th.props.selectIcon(li[Index].getElementsByClassName('ant-badge')[0].innerHTML))
          }(i))
        }
      }(j))
    }
  }
  render() {
    return (
      <div>
        <h3>方向性图标</h3>
        <ul class="anticons-list clearfix icons">
          <li class="">
            <i class="anticon anticon-step-backward"></i>
            <span class="anticon-class">
              <span class="ant-badge">step-backward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-step-forward"></i>
            <span class="anticon-class">
              <span class="ant-badge">step-forward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-fast-backward"></i>
            <span class="anticon-class">
              <span class="ant-badge">fast-backward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-fast-forward"></i>
            <span class="anticon-class">
              <span class="ant-badge">fast-forward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-shrink"></i>
            <span class="anticon-class">
              <span class="ant-badge">shrink</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-arrows-alt"></i>
            <span class="anticon-class">
              <span class="ant-badge">arrows-alt</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-down"></i>
            <span class="anticon-class">
              <span class="ant-badge">down</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-up"></i>
            <span class="anticon-class">
              <span class="ant-badge">up</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-caret-up"></i>
            <span class="anticon-class">
              <span class="ant-badge">caret-up</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-caret-down"></i>
            <span class="anticon-class">
              <span class="ant-badge">caret-down</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-caret-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">caret-left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-caret-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">caret-right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-up-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">up-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-down-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">down-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-left-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">left-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-right-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">right-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-up-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">up-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-down-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">down-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-right-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">right-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-left-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">left-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-double-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">double-right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-double-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">double-left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-verticle-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">verticle-left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-verticle-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">verticle-right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-forward"></i>
            <span class="anticon-class">
              <span class="ant-badge">forward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-backward"></i>
            <span class="anticon-class">
              <span class="ant-badge">backward</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-rollback"></i>
            <span class="anticon-class">
              <span class="ant-badge">rollback</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-enter"></i>
            <span class="anticon-class">
              <span class="ant-badge">enter</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-retweet"></i>
            <span class="anticon-class">
              <span class="ant-badge">retweet</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-swap"></i>
            <span class="anticon-class">
              <span class="ant-badge">swap</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-swap-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">swap-left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-swap-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">swap-right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-arrow-up"></i>
            <span class="anticon-class">
              <span class="ant-badge">arrow-up</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-arrow-down"></i>
            <span class="anticon-class">
              <span class="ant-badge">arrow-down</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-arrow-left"></i>
            <span class="anticon-class">
              <span class="ant-badge">arrow-left</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-arrow-right"></i>
            <span class="anticon-class">
              <span class="ant-badge">arrow-right</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-play-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">play-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-play-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">play-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-up-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">up-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-down-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">down-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-left-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">left-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-right-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">right-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-up-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">up-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-down-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">down-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-left-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">left-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-right-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">right-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-login"></i>
            <span class="anticon-class">
              <span class="ant-badge">login</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-logout"></i>
            <span class="anticon-class">
              <span class="ant-badge">logout</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-menu-fold"></i>
            <span class="anticon-class">
              <span class="ant-badge">menu-fold</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-menu-unfold"></i>
            <span class="anticon-class">
              <span class="ant-badge">menu-unfold</span>
            </span>
          </li>
        </ul>

        <h3>提示建议性图标</h3>
        <ul class="anticons-list clearfix icons">
          <li class="">
            <i class="anticon anticon-question"></i>
            <span class="anticon-class">
              <span class="ant-badge">question</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-question-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">question-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-question-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">question-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-plus"></i>
            <span class="anticon-class">
              <span class="ant-badge">plus</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-plus-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">plus-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-plus-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">plus-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pause"></i>
            <span class="anticon-class">
              <span class="ant-badge">pause</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pause-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">pause-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pause-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">pause-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-minus"></i>
            <span class="anticon-class">
              <span class="ant-badge">minus</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-minus-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">minus-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-minus-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">minus-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-plus-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">plus-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-plus-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">plus-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-minus-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">minus-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-minus-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">minus-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-info"></i>
            <span class="anticon-class">
              <span class="ant-badge">info</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-info-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">info-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-info-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">info-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-exclamation"></i>
            <span class="anticon-class">
              <span class="ant-badge">exclamation</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-exclamation-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">exclamation-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-exclamation-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">exclamation-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-close"></i>
            <span class="anticon-class">
              <span class="ant-badge">close</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-close-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">close-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-close-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">close-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-close-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">close-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-close-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">close-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-check"></i>
            <span class="anticon-class">
              <span class="ant-badge">check</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-check-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">check-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-check-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">check-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-check-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">check-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-check-square-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">check-square-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-clock-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">clock-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-clock-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">clock-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-warning"></i>
            <span class="anticon-class">
              <span class="ant-badge">warning</span>
            </span>
          </li>
        </ul>

        <h3>网站通用图标</h3>
        <ul class="anticons-list clearfix icons">
          <li class="">
            <i class="anticon anticon-lock"></i>
            <span class="anticon-class">
              <span class="ant-badge">lock</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-unlock"></i>
            <span class="anticon-class">
              <span class="ant-badge">unlock</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-area-chart"></i>
            <span class="anticon-class">
              <span class="ant-badge">area-chart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pie-chart"></i>
            <span class="anticon-class">
              <span class="ant-badge">pie-chart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-bar-chart"></i>
            <span class="anticon-class">
              <span class="ant-badge">bar-chart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dot-chart"></i>
            <span class="anticon-class">
              <span class="ant-badge">dot-chart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-bars"></i>
            <span class="anticon-class">
              <span class="ant-badge">bars</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-book"></i>
            <span class="anticon-class">
              <span class="ant-badge">book</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-calendar"></i>
            <span class="anticon-class">
              <span class="ant-badge">calendar</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud-download"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud-download</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-code"></i>
            <span class="anticon-class">
              <span class="ant-badge">code</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-code-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">code-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-copy"></i>
            <span class="anticon-class">
              <span class="ant-badge">copy</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-credit-card"></i>
            <span class="anticon-class">
              <span class="ant-badge">credit-card</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-delete"></i>
            <span class="anticon-class">
              <span class="ant-badge">delete</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-desktop"></i>
            <span class="anticon-class">
              <span class="ant-badge">desktop</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-download"></i>
            <span class="anticon-class">
              <span class="ant-badge">download</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-edit"></i>
            <span class="anticon-class">
              <span class="ant-badge">edit</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-ellipsis"></i>
            <span class="anticon-class">
              <span class="ant-badge">ellipsis</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file"></i>
            <span class="anticon-class">
              <span class="ant-badge">file</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-text"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-text</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-unknown"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-unknown</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-pdf"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-pdf</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-word"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-word</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-excel"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-excel</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-jpg"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-jpg</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-ppt"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-ppt</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-markdown"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-markdown
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-file-add"></i>
            <span class="anticon-class">
              <span class="ant-badge">file-add</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-folder"></i>
            <span class="anticon-class">
              <span class="ant-badge">folder</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-folder-open"></i>
            <span class="anticon-class">
              <span class="ant-badge">folder-open</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-folder-add"></i>
            <span class="anticon-class">
              <span class="ant-badge">folder-add</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-hdd"></i>
            <span class="anticon-class">
              <span class="ant-badge">hdd</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-frown"></i>
            <span class="anticon-class">
              <span class="ant-badge">frown</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-frown-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">frown-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-meh"></i>
            <span class="anticon-class">
              <span class="ant-badge">meh</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-meh-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">meh-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-smile"></i>
            <span class="anticon-class">
              <span class="ant-badge">smile</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-smile-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">smile-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-inbox"></i>
            <span class="anticon-class">
              <span class="ant-badge">inbox</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-laptop"></i>
            <span class="anticon-class">
              <span class="ant-badge">laptop</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-appstore-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">appstore-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-appstore"></i>
            <span class="anticon-class">
              <span class="ant-badge">appstore</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-line-chart"></i>
            <span class="anticon-class">
              <span class="ant-badge">line-chart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-link"></i>
            <span class="anticon-class">
              <span class="ant-badge">link</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-mail"></i>
            <span class="anticon-class">
              <span class="ant-badge">mail</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-mobile"></i>
            <span class="anticon-class">
              <span class="ant-badge">mobile</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-notification"></i>
            <span class="anticon-class">
              <span class="ant-badge">notification</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-paper-clip"></i>
            <span class="anticon-class">
              <span class="ant-badge">paper-clip</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-picture"></i>
            <span class="anticon-class">
              <span class="ant-badge">picture</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-poweroff"></i>
            <span class="anticon-class">
              <span class="ant-badge">poweroff</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-reload"></i>
            <span class="anticon-class">
              <span class="ant-badge">reload</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-search"></i>
            <span class="anticon-class">
              <span class="ant-badge">search</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-setting"></i>
            <span class="anticon-class">
              <span class="ant-badge">setting</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-share-alt"></i>
            <span class="anticon-class">
              <span class="ant-badge">share-alt</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-shopping-cart"></i>
            <span class="anticon-class">
              <span class="ant-badge">shopping-cart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tablet"></i>
            <span class="anticon-class">
              <span class="ant-badge">tablet</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tag"></i>
            <span class="anticon-class">
              <span class="ant-badge">tag</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tag-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">tag-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tags"></i>
            <span class="anticon-class">
              <span class="ant-badge">tags</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tags-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">tags-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-to-top"></i>
            <span class="anticon-class">
              <span class="ant-badge">to-top</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-upload"></i>
            <span class="anticon-class">
              <span class="ant-badge">upload</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-user"></i>
            <span class="anticon-class">
              <span class="ant-badge">user</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-video-camera"></i>
            <span class="anticon-class">
              <span class="ant-badge">video-camera</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-home"></i>
            <span class="anticon-class">
              <span class="ant-badge">home</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-spin anticon-loading"></i>
            <span class="anticon-class">
              <span class="ant-badge">loading</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-loading-3-quarters"></i>
            <span class="anticon-class">
              <span class="ant-badge">loading-3-quarters</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud-upload-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud-upload-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud-download-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud-download-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud-upload"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud-upload</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-cloud-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">cloud-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-star-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">star-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-star"></i>
            <span class="anticon-class">
              <span class="ant-badge">star</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-heart-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">heart-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-heart"></i>
            <span class="anticon-class">
              <span class="ant-badge">heart</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-environment"></i>
            <span class="anticon-class">
              <span class="ant-badge">environment</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-environment-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">environment-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-eye"></i>
            <span class="anticon-class">
              <span class="ant-badge">eye</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-eye-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">eye-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-camera"></i>
            <span class="anticon-class">
              <span class="ant-badge">camera</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-camera-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">camera-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-save"></i>
            <span class="anticon-class">
              <span class="ant-badge">save</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-team"></i>
            <span class="anticon-class">
              <span class="ant-badge">team</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-solution"></i>
            <span class="anticon-class">
              <span class="ant-badge">solution</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-phone"></i>
            <span class="anticon-class">
              <span class="ant-badge">phone</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-filter"></i>
            <span class="anticon-class">
              <span class="ant-badge">filter</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-exception"></i>
            <span class="anticon-class">
              <span class="ant-badge">exception</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-export"></i>
            <span class="anticon-class">
              <span class="ant-badge">export</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-customer-service"></i>
            <span class="anticon-class">
              <span class="ant-badge">customer-service</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-qrcode"></i>
            <span class="anticon-class">
              <span class="ant-badge">qrcode</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-scan"></i>
            <span class="anticon-class">
              <span class="ant-badge">scan</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-like"></i>
            <span class="anticon-class">
              <span class="ant-badge">like</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-like-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">like-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dislike"></i>
            <span class="anticon-class">
              <span class="ant-badge">dislike</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dislike-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">dislike-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-message"></i>
            <span class="anticon-class">
              <span class="ant-badge">message</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pay-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">pay-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pay-circle-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">pay-circle-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-calculator"></i>
            <span class="anticon-class">
              <span class="ant-badge">calculator</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pushpin"></i>
            <span class="anticon-class">
              <span class="ant-badge">pushpin</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-pushpin-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">pushpin-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-bulb"></i>
            <span class="anticon-class">
              <span class="ant-badge">bulb</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-select"></i>
            <span class="anticon-class">
              <span class="ant-badge">select</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-switcher"></i>
            <span class="anticon-class">
              <span class="ant-badge">switcher</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-rocket"></i>
            <span class="anticon-class">
              <span class="ant-badge">rocket</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-bell"></i>
            <span class="anticon-class">
              <span class="ant-badge">bell</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-disconnect"></i>
            <span class="anticon-class">
              <span class="ant-badge">disconnect</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-database"></i>
            <span class="anticon-class">
              <span class="ant-badge">database</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-compass"></i>
            <span class="anticon-class">
              <span class="ant-badge">compass</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-barcode"></i>
            <span class="anticon-class">
              <span class="ant-badge">barcode</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-hourglass"></i>
            <span class="anticon-class">
              <span class="ant-badge">hourglass</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-key"></i>
            <span class="anticon-class">
              <span class="ant-badge">key</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-flag"></i>
            <span class="anticon-class">
              <span class="ant-badge">flag</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-layout"></i>
            <span class="anticon-class">
              <span class="ant-badge">layout</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-printer"></i>
            <span class="anticon-class">
              <span class="ant-badge">printer</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-sound"></i>
            <span class="anticon-class">
              <span class="ant-badge">sound</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-usb"></i>
            <span class="anticon-class">
              <span class="ant-badge">usb</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-skin"></i>
            <span class="anticon-class">
              <span class="ant-badge">skin</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-tool"></i>
            <span class="anticon-class">
              <span class="ant-badge">tool</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-sync"></i>
            <span class="anticon-class">
              <span class="ant-badge">sync</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-wifi"></i>
            <span class="anticon-class">
              <span class="ant-badge">wifi</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-car"></i>
            <span class="anticon-class">
              <span class="ant-badge">car</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-schedule"></i>
            <span class="anticon-class">
              <span class="ant-badge">schedule</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-user-add"></i>
            <span class="anticon-class">
              <span class="ant-badge">user-add</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-user-delete"></i>
            <span class="anticon-class">
              <span class="ant-badge">user-delete</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-usergroup-add"></i>
            <span class="anticon-class">
              <span class="ant-badge">usergroup-add</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-usergroup-delete"></i>
            <span class="anticon-class">
              <span class="ant-badge">usergroup-delete</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-man"></i>
            <span class="anticon-class">
              <span class="ant-badge">man</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-woman"></i>
            <span class="anticon-class">
              <span class="ant-badge">woman</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-shop"></i>
            <span class="anticon-class">
              <span class="ant-badge">shop</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-gift"></i>
            <span class="anticon-class">
              <span class="ant-badge">gift</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-idcard"></i>
            <span class="anticon-class">
              <span class="ant-badge">idcard</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-medicine-box"></i>
            <span class="anticon-class">
              <span class="ant-badge">medicine-box</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-red-envelope"></i>
            <span class="anticon-class">
              <span class="ant-badge">red-envelope</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-coffee"></i>
            <span class="anticon-class">
              <span class="ant-badge">coffee</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-copyright"></i>
            <span class="anticon-class">
              <span class="ant-badge">copyright</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-trademark"></i>
            <span class="anticon-class">
              <span class="ant-badge">trademark</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-safety"></i>
            <span class="anticon-class">
              <span class="ant-badge">safety</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-wallet"></i>
            <span class="anticon-class">
              <span class="ant-badge">wallet</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-bank"></i>
            <span class="anticon-class">
              <span class="ant-badge">bank</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-trophy"></i>
            <span class="anticon-class">
              <span class="ant-badge">trophy</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-contacts"></i>
            <span class="anticon-class">
              <span class="ant-badge">contacts</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-global"></i>
            <span class="anticon-class">
              <span class="ant-badge">global</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-shake"></i>
            <span class="anticon-class">
              <span class="ant-badge">shake</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-api"></i>
            <span class="anticon-class">
              <span class="ant-badge">api</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-fork"></i>
            <span class="anticon-class">
              <span class="ant-badge">fork</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dashboard"></i>
            <span class="anticon-class">
              <span class="ant-badge">dashboard</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-form"></i>
            <span class="anticon-class">
              <span class="ant-badge">form</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-table"></i>
            <span class="anticon-class">
              <span class="ant-badge">table</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-profile"></i>
            <span class="anticon-class">
              <span class="ant-badge">profile</span>
            </span>
          </li>
        </ul>

        <h3>品牌和标识</h3>
        <ul class="anticons-list clearfix icons">
          <li class="">
            <i class="anticon anticon-android"></i>
            <span class="anticon-class">
              <span class="ant-badge">android</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-android-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">android-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-apple"></i>
            <span class="anticon-class">
              <span class="ant-badge">apple</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-apple-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">apple-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-windows"></i>
            <span class="anticon-class">
              <span class="ant-badge">windows</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-windows-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">windows-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-ie"></i>
            <span class="anticon-class">
              <span class="ant-badge">ie</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-chrome"></i>
            <span class="anticon-class">
              <span class="ant-badge">chrome</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-github"></i>
            <span class="anticon-class">
              <span class="ant-badge">github</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-aliwangwang"></i>
            <span class="anticon-class">
              <span class="ant-badge">aliwangwang</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-aliwangwang-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">aliwangwang-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dingding"></i>
            <span class="anticon-class">
              <span class="ant-badge">dingding</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dingding-o"></i>
            <span class="anticon-class">
              <span class="ant-badge">dingding-o</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-weibo-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">weibo-square</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-weibo-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">weibo-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-taobao-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">taobao-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-html5"></i>
            <span class="anticon-class">
              <span class="ant-badge">html5</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-weibo"></i>
            <span class="anticon-class">
              <span class="ant-badge">weibo</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-twitter"></i>
            <span class="anticon-class">
              <span class="ant-badge">twitter</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-wechat"></i>
            <span class="anticon-class">
              <span class="ant-badge">wechat</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-youtube"></i>
            <span class="anticon-class">
              <span class="ant-badge">youtube</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-alipay-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">alipay-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-taobao"></i>
            <span class="anticon-class">
              <span class="ant-badge">taobao</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-skype"></i>
            <span class="anticon-class">
              <span class="ant-badge">skype</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-qq"></i>
            <span class="anticon-class">
              <span class="ant-badge">qq</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-medium-workmark"></i>
            <span class="anticon-class">
              <span class="ant-badge">medium-workmark</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-gitlab"></i>
            <span class="anticon-class">
              <span class="ant-badge">gitlab</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-medium"></i>
            <span class="anticon-class">
              <span class="ant-badge">medium</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-linkedin"></i>
            <span class="anticon-class">
              <span class="ant-badge">linkedin</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-google-plus"></i>
            <span class="anticon-class">
              <span class="ant-badge">google-plus</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dropbox"></i>
            <span class="anticon-class">
              <span class="ant-badge">dropbox</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-facebook"></i>
            <span class="anticon-class">
              <span class="ant-badge">facebook</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-codepen"></i>
            <span class="anticon-class">
              <span class="ant-badge">codepen</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-amazon"></i>
            <span class="anticon-class">
              <span class="ant-badge">amazon</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-google"></i>
            <span class="anticon-class">
              <span class="ant-badge">google</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-codepen-circle"></i>
            <span class="anticon-class">
              <span class="ant-badge">codepen-circle</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-alipay"></i>
            <span class="anticon-class">
              <span class="ant-badge">alipay</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-ant-design"></i>
            <span class="anticon-class">
              <span class="ant-badge">ant-design</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-aliyun"></i>
            <span class="anticon-class">
              <span class="ant-badge">aliyun</span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-zhihu"></i>
            <span class="anticon-class">
              <span class="ant-badge">zhihu
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-slack"></i>
            <span class="anticon-class">
              <span class="ant-badge">slack
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-slack-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">slack-square
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-behance"></i>
            <span class="anticon-class">
              <span class="ant-badge">behance
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-behance-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">behance-square
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dribbble"></i>
            <span class="anticon-class">
              <span class="ant-badge">dribbble
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-dribbble-square"></i>
            <span class="anticon-class">
              <span class="ant-badge">dribbble-square
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-instagram"></i>
            <span class="anticon-class">
              <span class="ant-badge">instagram
                <sup data-show="true" class="ant-scroll-number ant-badge-dot"></sup>
              </span>
            </span>
          </li>
          <li class="">
            <i class="anticon anticon-yuque"></i>
            <span class="anticon-class">
              <span class="ant-badge">yuque
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