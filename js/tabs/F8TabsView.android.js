/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 * @providesModule F8TabsView
 */

'use strict';

var F8Colors = require('F8Colors');
var F8NotificationsView = require('F8NotificationsView');
var React = require('React');
var Navigator = require('Navigator');
var F8DrawerLayout = require('F8DrawerLayout');
var View = require('View');
var StyleSheet = require('StyleSheet');
var TouchableOpacity = require('TouchableOpacity');
var Image = require('Image');
var { Text } = require('F8Text');
var MenuItem = require('./MenuItem');
const F8Button = require('F8Button');
var unseenNotificationsCount = require('./notifications/unseenNotificationsCount');
var Home = require('./home/Home');
var Account = require('./account/Account');

var { switchTab } = require('../actions');
var { connect } = require('react-redux');

import type {Tab} from '../reducers/navigation';

class F8TabsView extends React.Component {
    props: {
        tab: Tab;
        onTabSelect: (tab: Tab) => void;
        navigator: Navigator;
    };

    constructor(props) {
        super(props);

        this.renderNavigationView = this.renderNavigationView.bind(this);
        this.openProfileSettings = this.openProfileSettings.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }

    getChildContext() {
        return {
            openDrawer: this.openDrawer,
            hasUnreadNotifications: this.props.notificationsBadge > 0,
        };
    }

    openDrawer() {
        this.refs.drawer.openDrawer();
    }

    onTabSelect(tab: Tab) {
        if (this.props.tab !== tab) {
            this.props.onTabSelect(tab);
        }
        this.refs.drawer.closeDrawer();
    }

    openProfileSettings() {
        this.refs.drawer.closeDrawer();
        this.props.navigator.push({shareSettings: true});
    }

    renderNavigationView() {
        var drawerItem;

        var name = 'welcome';
        drawerItem = (
            <View>
                <Text style={styles.name}>
                    {name.toUpperCase()}
                </Text>
            </View>
        );
        
        return (
            <View style={styles.drawer}>
                <Image
                style={styles.header}
                source={require('./img/drawer-header.png')}>
                    {drawerItem}
                </Image>
                
                <MenuItem
                title="Home"
                selected={this.props.tab === 'home'}
                onPress={this.onTabSelect.bind(this, 'home')}
                badge={this.props.notificationsBadge}
                icon={require('./home/img/info-icon.png')}
                selectedIcon={require('./home/img/info-icon-active.png')}
                />

                <MenuItem
                title="Account"
                selected={this.props.tab === 'account'}
                onPress={this.onTabSelect.bind(this, 'account')}
                icon={require('./home/img/info-icon.png')}
                selectedIcon={require('./home/img/info-icon-active.png')}
                />
            </View>
        );
    }

    // renderContent() {
    //     return <F8NotificationsView navigator={this.props.navigator} />; 

    //     throw new Error(`Unknown tab ${this.props.tab}`);
    // }

    renderContent() {
        switch (this.props.tab) {
            case 'home':
                return <Home navigator={this.props.navigator} />;

            case 'account':
                return <Account navigator={this.props.navigator} />;
        } 

        throw new Error(`Unknown tab ${this.props.tab}`);
    }

    render() {
        return (
            <F8DrawerLayout
            ref="drawer"
            drawerWidth={290}
            drawerPosition="left"
            renderNavigationView={this.renderNavigationView}>
                <View style={styles.content} key={this.props.tab}>
                    {this.renderContent()}
                </View>
            </F8DrawerLayout>
        );
    }
}

F8TabsView.childContextTypes = {
    openDrawer: React.PropTypes.func,
    hasUnreadNotifications: React.PropTypes.number,
};

function select(store) {
    return {
        tab: store.navigation.tab,
        day: store.navigation.day,
        user: store.user,
        notificationsBadge: unseenNotificationsCount(store) + store.surveys.length,
    };
}

function actions(dispatch) {
    return {
        onTabSelect: (tab) => dispatch(switchTab(tab)),
    };
}

var styles = StyleSheet.create({
    drawer: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
    },
        header: {
        padding: 20,
        justifyContent: 'flex-end',
    },
    name: {
        marginTop: 10,
        color: 'black',
        fontSize: 12,
    },
    loginPrompt: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    loginText: {
        fontSize: 12,
        color: F8Colors.lightText,
        textAlign: 'center',
        marginBottom: 10,
    },
});

module.exports = connect(select, actions)(F8TabsView);
