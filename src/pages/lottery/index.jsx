import { getSession } from '@/servers/servers';
import { Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  state = {
    sessionData: [],
  };
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.init();
  }

  componentDidHide() {}

  init = async () => {
    try {
      const res = await getSession();
      if (res.code == 200) {
        this.setState({
          sessionData: res.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  //
  renderState = (start_time, end_time) => {
    const timestamp = Date.parse(new Date()) / 1000;
    // if (start_time < timestamp) {
    if (end_time < timestamp) {
      return '已结束';
    }
    return '点击进入';
    // }
    // return '未开始';
  };

  renderColor = (item) => {
    const { start_time, end_time } = item;
    const timestamp = Date.parse(new Date()) / 1000;
    if (start_time > timestamp || end_time < timestamp) {
      return true;
    }
    return false;
  };

  //
  goToDetail = (item, index) => {
    const { start_time, end_time, type, is_draw } = item;
    const { sessionData } = this.state;
    const timestamp = Date.parse(new Date()) / 1000;

    // 抽奖未开始
    if (start_time > timestamp) {
      if (index == 0) {
        // 幸运奖不看视频
        Taro.navigateTo({
          url: `pages/detail/index?key=${type}`,
        });
      } else {
        // 去看视频
        Taro.navigateTo({
          url: `pages/index/index?key=${type}`,
        });
      }
      return false;
    }
    // 抽奖结束或已经抽过奖(直接进入详情页)
    if (end_time < timestamp || is_draw == 1) {
      Taro.navigateTo({
        url: `pages/detail/index?key=${type}`,
      });
    } else {
      // 抽奖开始
      if (index == 0) {
        // 幸运奖不看视频
        Taro.navigateTo({
          url: `pages/detail/index?key=${type}`,
        });
      } else {
        // 去看视频(上一轮未参加)
        if (sessionData[index - 1].is_draw == 0) {
          return Taro.showToast({
            title: '请先参加上一轮抽奖',
            icon: 'none',
          });
        } else {
          // 去看视频
          Taro.navigateTo({
            url: `pages/index/index?key=${type}`,
          });
        }
      }
    }
  };

  render() {
    const { sessionData } = this.state;
    return (
      <div className='lottery_bg'>
        <div className='lottery'>
          <Image
            className='logoPng'
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/logo.png'
          />
          <div className='wrap'>
            {sessionData.map((item, index) => {
              return (
                <div className='awards' key={item.id}>
                  <div className='session'>第 {index + 1} 轮</div>
                  <img
                    className='award'
                    src={`https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/award${item.id}.png`}
                  />
                  <div className='note'>图片仅供参考，最终发放以实物为准</div>
                  <div className='info'>
                    <div className='top'>
                      <div className='prize'>奖品：{item.note}</div>
                      <div className='peoples'>数量：{item.num}</div>
                    </div>
                    <div className='bootom'>抽奖时间：{item.start_date}</div>
                  </div>
                  <div
                    // className={classNames('joinPng', {
                    //   gray: this.renderColor(item),
                    // })}
                    className='joinPng'
                    onClick={() => this.goToDetail(item, index)}
                  >
                    {this.renderState(item.start_time, item.end_time)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
