import React, { FunctionComponent } from "react";

enum LoadState {
  LOADING,
  LOADED
}

type LoaderProps = {
  loadState: LoadState;
};

const Loader: FunctionComponent<LoaderProps> = ({ loadState, children }) => (
  <>{loadState === LoadState.LOADING ? <p>loading</p> : children}</>
);

export { LoadState, Loader as default };
