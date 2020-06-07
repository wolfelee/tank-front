import React from 'react';
import './SetAdminPanel.less';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";
import PhaseSelectingPanel from "./inner/PhaseSelectingPanel";
import PhaseVerifyPanel from "./inner/PhaseVerifyPanel";
import PhaseCreatePanel from "./inner/PhaseCreatePanel";

enum Phase {
  //选择界面
  SELECTING = "SELECTING",
  //验证管理员
  VERIFY = "VERIFY",
  //创建管理员
  CREATE = "CREATE",
}

interface IProps {

  install: Install

  onPreStep: () => void
  onNextStep: () => void
}

interface IState {

}

export default class SetAdminPanel extends TankComponent<IProps, IState> {

  phase: Phase = Phase.SELECTING

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

    that.refreshAdminList();
  }


  refreshAdminList() {
    //开始创建管理员
    let that = this;
    let install: Install = this.props.install
    install.httpAdminList(function () {
      if (install.adminList.length) {
        that.phase = Phase.SELECTING
      } else {
        that.phase = Phase.CREATE
      }
      that.updateUI()
    })
  }

  goToPrevious() {
    let that = this

    this.props.onPreStep()

  }

  goToNext() {
    let that = this
    let install: Install = this.props.install

    if (install.tableCreated()) {

      this.props.onNextStep()

    } else {
      MessageBoxUtil.error("请首先完成建表")
    }

  }


  render() {

    let that = this;
    let install: Install = this.props.install
    let phase: Phase = this.phase

    return (
      <div className="widget-set-admin-panel">
        {phase === Phase.SELECTING && (

          <PhaseSelectingPanel install={install} onRefresh={this.refreshAdminList.bind(this)}
                               onSelectVerify={() => {
                                 that.phase = Phase.VERIFY
                                 that.updateUI()
                               }} onSelectCreate={() => {
            that.phase = Phase.VERIFY
            that.updateUI()
          }} onPreStep={this.goToPrevious.bind(this)} onNextStep={this.goToNext.bind(this)}
          />
        )}

        {phase === Phase.VERIFY && (
          <PhaseVerifyPanel install={install}/>
        )}

        {phase === Phase.CREATE && (
          <PhaseCreatePanel install={install}/>
        )}

      </div>
    )

  }
}
