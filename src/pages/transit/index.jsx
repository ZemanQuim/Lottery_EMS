import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='transit'>
        <Image
          className='zfPng'
          src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/xinchunzf.png'
        />
        <View
          className='open_btn'
          onClick={() => Taro.navigateTo({ url: 'pages/lottery/index' })}
        ></View>
      </View>
    );
  }
}

export default Index;
