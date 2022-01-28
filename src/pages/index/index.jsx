import { Image, Video, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import './index.scss';

const videoArr = [
  'https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/video_2021.mp4',
  'https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/video_2021_1.mp4',
  'https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/video_2021_2.mp4',
  'https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/video_2021_3.mp4',
  'https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/video_2021_4.mp4',
];

@inject('store')
@observer
class Index extends Component {
  state = {
    isShow: false,
    key: 0,
  };

  componentWillMount() {}

  componentDidMount() {
    let token = Taro.getStorageSync('Authorization') || null;
    if (token) {
      this.setState({
        isShow: true,
      });
    }
  }

  componentWillUnmount() {}

  onLoad(options) {
    let { key } = options;
    this.setState({
      key: key || 0,
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  onEnded = () => {
    const { key } = this.state;
    if (key != 0) {
      Taro.redirectTo({
        url: `pages/detail/index?key=${key}`,
      });
    } else {
      Taro.redirectTo({
        url: 'pages/login/index',
      });
    }
  };

  handleSkip = () => {
    Taro.redirectTo({
      url: `pages/transit/index`,
    });
  };

  render() {
    // const {
    //   counterStore: { counter },
    // } = this.props.store;
    const { isShow, key } = this.state;

    return (
      <View className='wish_video'>
        <View className='logo_wrap'>
          <Image
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/logo.png'
            className='logo'
          />
        </View>
        <View className='dec00'>
          <Image
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/wish_video5.png'
            className='dec01'
          />
          <View className='dec02'>恭贺新春 新年快乐</View>
        </View>
        <View className='notice'>
          <p>中国邮政集团有限公司蚌埠市分公司</p>
          <p>祝全体同仁新年快乐</p>
          <p>欢欢喜喜过大年！</p>
        </View>
        <View className='dec03'>观看完视频可以抽奖哦！</View>
        <View className='video'>
          <View className='head'>2022拜年祝福视频</View>
          <Video
            className='video0'
            controls={false}
            showFullscreenBtn={false}
            enableProgressGesture={false}
            src={videoArr[key]}
            onEnded={this.onEnded}
            autoplay
            preload='auto'
            x-webkit-airplay='allow'
            x5-video-player-type='h5'
            x5-video-player-fullscreen='true'
            x5-video-orientation='portrait'
            playsinline
            webkit-playsinline
          />
          <div className='tip'>
            增强大局观念 强化系统意识 坚持底线思维 狠抓执行落实
          </div>
        </View>
        {isShow && !key ? (
          <span className='skip' onClick={this.handleSkip}>
            跳过祝福视频
          </span>
        ) : null}
        <View className='dec04'></View>
      </View>
    );
  }
}

export default Index;
