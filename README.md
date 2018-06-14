# nqm-api-tdx-react

***WORK IN PROGRESS***

A library of React components providing declarative/compositional access to the TDX.

## install
```
npm install --save @nqminds/nqm-api-tdx-react
```
## pattern

All components follow a similar pattern whereby the TDX operation is parameterised using React properties and a single child component receives the results of the operation, again via React properties. 

## ResourceData

Loads data from a TDX dataset.

### properties

- authToken [string] - optional authentication token to use when connecting to the TDX
- filter [object] - optional mongodb filter expression, e.g. `{temperature: {$gt: 30}}`
- lazyLoad [boolean] - optional flag, if set the data won't load until explicitly requested via the `load` child property.
- limit [number] - optional number of data documents to return
- resourceId [string] - the id of the resource to load
- skip [number] - optional number of data documents to skip
- sort [object] - optional mongodb sort expression, e.g. `{timestamp: -1}`
- tdxApi [object] - optional TDXApi instance
- tdxConfig [object] - optional TDX connection configuration (as defined by TDXApi)


### child properties

A single functional component must be specified as a child of `ResourceData` which will be rendered any time the internal state changes. The child component will be passed the following properties.
- data [array] - an array of documents matching the load criteria
- error [object] - an `Error` object or null if no error occurred
- load [function] - a function that can be called to load the data now
- loaded [boolean] - flag indicating that the data has been loaded and will be present in the `data` property
- loading [boolean] - flag indicating that data loading is in progress

### example
Load 1000 documents from a dataset (the default `limit` property if not given is 1000).
```
<ResourceData
  lazyLoad
  resourceId="HkgLYO5LgQ"
  tdxApi={appApi}
>
  {
    ({data, error, load, loaded, loading}) => {
      if (error) {
        return <div>{error.message}</div>;
      } else if (loading) {
        return <div>LOADING</div>;
      } else if (loaded) {
        return <Chart data={data} />;
      } else {
        return <Button onClick={load}>Show chart</Button>;
      }
    }
  }
</ResourceData>
```
## ResourceWatch

Subscribes to a TDX dataset publication. 

### example
Load the 10 most recent documents from a dataset sorted by timestamp.
```
<ResourceWatch
  authToken="DKAJFSAKJkdjfsafsadjfkJ"
  lazyLoad
  limit=10
  resourceId="HkgLYO5LgQ"
  sort={{timestamp: -1}}
  tdxConfig={{ddpServer: "https://ddp.nq-m.com"}}
>
  {
    ({data, error, load, loaded, loading}) => {
      if (error) {
        return <div>{error.message}</div>;
      } else if (loading) {
        return <div>LOADING</div>;
      } else if (loaded) {
        return <Chart data={data} />;
      } else {
        return <Button onClick={load}>Show chart</Button>;
      }
    }
  }
</ResourceData>
```
