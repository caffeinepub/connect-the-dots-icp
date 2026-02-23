module {
  type Actor = {
    // Everything needed for data persistence after redeploy
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
