/* eslint-disable no-underscore-dangle */
import React from "react";
import PropTypes from "prop-types";
import {TDXApi} from "@nqminds/nqm-tdx-client";

class ResourceData extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    credentials: PropTypes.string,
    filter: PropTypes.object,
    ip: PropTypes.string,
    lazyLoad: PropTypes.bool,
    limit: PropTypes.number,
    load: PropTypes.func,
    loading: PropTypes.bool,
    projection: PropTypes.object,
    resourceId: PropTypes.string.isRequired,
    skip: PropTypes.number,
    tdxApi: PropTypes.object,
    tdxConfig: PropTypes.object,
    ttl: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.__unmounted = false;

    this.state = {
      connected: false,
      connecting: false,
      loading: false,
      loaded: false,
      tdxApi: props.tdxApi,
    };
  }

  componentWillMount() {
    const {lazyLoad} = this.props;
    if (!lazyLoad) {
      this.load();
    }
  }

  componentWillReceiveProps(props) {
    if (props.tdxApi !== this.props.tdxApi) {
      this.setState({tdxApi: props.tdxApi});
    }
  }

  componentWillUnmount() {
    this.__unmounted = true;
  }

  _connect() {
    if (this.state.connected) {
      return Promise.resolve();
    }

    const {credentials, ip, tdxConfig, ttl} = this.props;

    this.setState({connecting: true});

    let apiPromise;
    if (!this.state.tdxApi) {
      if (!tdxConfig) {
        throw new Error("No tdxApi and tdxConfig not given => can't connect to TDX");
      }
      const api = new TDXApi(tdxConfig);
      if (credentials) {
        apiPromise = api.authenticate(credentials, null, ttl, ip).then(() => api);
      } else {
        apiPromise = Promise.resolve(api);
      }
    } else {
      apiPromise = Promise.resolve(this.state.tdxApi);
    }

    return apiPromise.then((api) => {
      this.setState({connecting: false, connected: true, tdxApi: api});
    });
  }

  _doLoad() {
    if (!this.state.connected) {
      return Promise.reject(new Error("not connected"));
    }
    this.setState({loading: true});

    const {filter, limit, projection, resourceId, skip} = this.props;
    return this.state.tdxApi.getData(resourceId, filter, projection, {limit, skip})
      .then((response) => {
        if (this.__unmounted) {
          // Component was unmounted while waiting for the response => do nothing.
        } else {
          this.setState({data: response.data, loading: false, loaded: true});
        }
      })
      .catch((err) => {
        this.setState({loading: false, loaded: false, error: err});
      });
  }

  load() {
    return this._connect()
      .then(() => {
        return this._doLoad();
      });
  }

  render() {
    const {children} = this.props;
    return children({
      error: this.state.error,
      data: this.state.data,
      resource: this.state.resource,
      loaded: this.state.loaded,
      loading: this.state.loading,
      load: this.load.bind(this),
    });
  }
}

export default ResourceData;
