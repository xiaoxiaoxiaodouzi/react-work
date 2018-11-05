import React from 'react';
import { Row, Col, Button, Select, Popover, Tag } from 'antd';
import QuickSearch from '../../utils/quickSearch';
export default class TagManager extends React.PureComponent {

    static defaultProps = {
        selectedTags: [],
        allTags: []
    }

    constructor(props) {
        super(props)

        this.state = {
            visible: props.visible
        }

        this.selectedTags = {};
        this.tags = {};
        this.tagtempcontent = null;
        this.tagitem = null;
        this.focus = false;

        props.selectedTags.forEach((element) => {
            this.selectedTags[element.id] = element.name;
        })

        props.allTags.forEach((element) => {
            this.tags[element.id] = element;
        })

        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
        this.onTagsManagerCommit = this.onTagsManagerCommit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.selectedTags = {};
        var th = this;
        nextProps.selectedTags.forEach((element) => {
            th.selectedTags[element.id] = element.name;
        })

        nextProps.allTags.forEach((element) => {
            th.tags[element.id] = element;
        })
    }
    //************************************************************************ */
    //*********************************EVENTS********************************* */
    //************************************************************************ */
    //标签管理搜索框回调
    onSearch(value) {
        if (this.focus) {
            this.tagitem = null;
            this.tagtempcontent = value;
        }
    }

    //失去标点回调
    onBlur() {
        this.focus = false;
    }

    //获得焦点回调
    onFocus() {
        this.focus = true;
    }

    //标签管理选中回调
    onChange(value) {
        if (this.focus) {
            this.tagtempcontent = null;
            this.tagitem = this.tags[value];
        }
    }

    //标签弹窗管理可见回调
    onVisibleChange(visible) {
        this.tagtempcontent = null;
        // this.tagitem = null;
        this.props.onVisibleChange && this.props.onVisibleChange(visible);
    }

    // 匹配已存在标签/创建新标签，并绑定标签
    onTagsManagerCommit() {
        //无有效选中或输入过滤
        if (!this.tagitem && !this.tagtempcontent) {
            this.setState({
                visible: false
            })
        } else {
            if (this.tagtempcontent != null) {
                var result = QuickSearch.query(this.props.allTags, ['name', '==', this.tagtempcontent])
                //绑定输入框中匹配的已存在标签
                if (result.length > 0) {
                    this.props.onChange && this.props.onChange({ event: 'add', value: result[0] })
                } else {
                    //创建绑定标签
                    this.props.onChange && this.props.onChange({ event: 'create', value: { name: this.tagtempcontent } })
                }
            } else {
                //过滤重复选中
                var isRepetition = false;
                for (let index = 0; index < this.props.selectedTags.length; index++) {
                    const element = this.props.selectedTags[index];
                    if (element.name === this.tagitem.name) {
                        isRepetition = true;
                        break;
                    }
                }
                //绑定选中已经存在的标签
                if (!isRepetition) {
                    this.props.onChange && this.props.onChange({ event: 'add', value: this.tagitem })
                }
            }
            this.setState({
                visible: false
            })
        }
    }

    //移除标签逻辑
    removeTag(tag) {
        this.props.onChange && this.props.onChange({ event: 'remove', value: tag })
    }

    //************************************************************************ */
    //**********************************UI************************************ */
    //************************************************************************ */
    renderTagsAddContainer() {
        var th = this;
        return (
            <Row type={'flex'}>
                <Col>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="输入新标签"
                        optionFilterProp="children"
                        onSearch={this.onSearch}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        onChange={this.onChange}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {this.props.allTags.map((element) => {
                            return (
                                <Select.Option key={element.id} disabled={th.selectedTags[element.id] != null} value={element.id}>{element.name}</Select.Option>
                            )
                        })}
                    </Select>
                </Col>
                <Col>
                    <Button style={{ marginLeft: 10 }} icon={'check'} onClick={this.onTagsManagerCommit} />
                    <Button style={{ marginLeft: 10 }} icon={'close'} onClick={() => { this.setState({ visible: false }) }} />
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <span style={[{ justifyContent: 'center', lineHeight: '22px' },this.props.style]}>
                {this.props.selectedTags.map((element) => {
                    return <Tag key={element.id} style={{ marginRight: 10 }} closable onClose={() => { this.removeTag(element) }}>{element.name}</Tag>
                })}
                <Popover visible={this.state.visible} trigger={'click'} onVisibleChange={this.onVisibleChange} content={this.renderTagsAddContainer()} title="添加标签" onClick={() => this.setState({ visible: true })}>
                    <Button type="dashed" icon={'plus'} size={'small'} />
                </Popover>
            </span>
        )
    }
}