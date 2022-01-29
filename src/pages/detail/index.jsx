import { drawLottery, getHome, getDrawRecord } from '@/servers/servers';
import { Popup } from '@taroify/core';
import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import className from 'classnames';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import './index.scss';

const awardArr = ['', '一等奖', '二等奖', '三等奖', '四等奖', '幸运奖'];
const giftArr = [
  '',
  '价值500元多功能咖啡饮水一体机',
  '价值300元早餐机',
  '价值200元电热饭盒',
  '价值100元橄榄油',
  '价值50元虎年抱枕',
];

@inject('store')
@observer
class Index extends Component {
  state = {
    key: 0,
    homeData: {},
    suceessOpen: false,
    failOpen: false,
    recordOpen: false,
    recordList: [],
  };
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onLoad(options) {
    if (options) {
      this.setState(
        {
          key: options.key,
        },
        () => {
          this.init();
        }
      );
    }
  }

  init = async () => {
    const { key } = this.state;
    try {
      const res = await getHome({ key });
      if (res.code == 200) {
        this.setState({
          homeData: res.data,
        });
      }
    } catch (error) {}
  };

  // 抽奖
  draw = async () => {
    const { key } = this.state;
    try {
      const { code, data, message } = await drawLottery({ key });
      if (code == 200) {
        this.setState(
          {
            suceessOpen: key == data.result.prize_type,
            failOpen: key != data.result.prize_type,
          },
          () => {
            this.init();
          }
        );
      } else {
        Taro.showToast({
          title: message || '抽奖失败',
          icon: 'none',
        });
      }
    } catch (error) {}
  };

  renderNotice = (prize_type) => {
    if (prize_type && prize_type !== 6) {
      return (
        <div className='notice'>
          <p>恭喜您获得“{awardArr[prize_type]}”</p>
          <p>请返回继续抽下一轮奖品</p>{' '}
        </div>
      );
    } else if (prize_type == 6) {
      return (
        <div className='notice'>
          <p>很遗憾，未中奖。</p>
          <p>请返回继续抽下一轮奖品</p>
        </div>
      );
    } else {
      return (
        <div className='notice'>
          <p>请点击上方福袋按钮抽取奖品</p>
        </div>
      );
    }
  };

  getRecord = async () => {
    const { key } = this.state;
    try {
      const res = await getDrawRecord({ key });
      this.setState({
        recordOpen: true,
        recordList: res.data || [],
      });
    } catch (error) {}
  };

  render() {
    const { homeData, key, suceessOpen, failOpen, recordOpen, recordList } =
      this.state;

    return (
      <View className='detail'>
        <Image
          className='logoPng'
          src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/logo.png'
        />
        <div className='lucky'>
          <Image
            className='lucky_bag'
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/detail1.png'
          />
          <Image
            className='switchPng'
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/detail5.png'
            onClick={this.draw}
          />
          <Image
            className={className('handPng', {
              none: !!homeData.myPrize?.prize_type || false,
            })}
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/detail2.png'
          />
        </div>
        {this.renderNotice(homeData.myPrize?.prize_type || 0)}
        <Image
          className='see_record'
          src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/detail6.png'
          onClick={this.getRecord}
        />
        <div className='direction'>
          <img
            className='title'
            src={`https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/award${key}.png`}
          />
          <div className='awards'>{giftArr[key]}</div>
          <div className='tips'>
            注：奖项分为一等奖、二等奖、三等奖、四等奖、幸运奖、未中奖，总共六个。
          </div>
          <div className='tips'>图片仅供参考，最终发放以实物为准</div>
        </div>
        {/* 中奖 */}
        <Popup open={suceessOpen}>
          <div className='popup suceess'>
            <div className='title'>中奖啦!</div>
            <div className='award'>恭喜您获得“{awardArr[key]}”</div>
            <div className='blessing'>
              <div className='line'></div>
              <span className='fz28'>新年祝福语</span>
              <div className='text'>
                圆圆的梦想,七色的花;圆圆的人生,五彩的
                画;圆圆的春节,幸福的家;圆圆的问候,事业
                大发;圆圆的你笑哈哈!祝你春节快乐!
              </div>
            </div>
            <div
              className='close_btn'
              onClick={() => {
                this.setState({ suceessOpen: false });
              }}
            ></div>
          </div>
        </Popup>
        {/* 未中奖 */}
        <Popup open={failOpen}>
          <div className='popup fail'>
            <div className='title'>好可惜~</div>
            <div className='award'>您与大奖擦肩而过~</div>
            <div className='blessing'>
              <div className='line'></div>
              <span className='fz28'>新年祝福语</span>
              <div className='text'>
                圆圆的梦想,七色的花;圆圆的人生,五彩的
                画;圆圆的春节,幸福的家;圆圆的问候,事业
                大发;圆圆的你笑哈哈!祝你春节快乐!
              </div>
            </div>
            <div
              className='close_btn'
              onClick={() => {
                this.setState({ failOpen: false });
              }}
            ></div>
          </div>
        </Popup>
        {/* 中奖记录 */}
        <Popup open={recordOpen}>
          <div className='pop_bg'>
            <div className='wrap'>
              {recordList.length == 0 ? (
                <p>暂无记录</p>
              ) : (
                recordList.map((item) => {
                  return <p key={item.id}>{item.note}</p>;
                })
              )}
            </div>
            <div
              className='close'
              onClick={() => this.setState({ recordOpen: false })}
            >
              关闭
            </div>
          </div>
        </Popup>
      </View>
    );
  }
}

export default Index;
