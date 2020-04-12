import ReactReconciler from "react-reconciler";
import Reconciler, { OpaqueHandle } from "react-reconciler";

import { Action } from "./interfaces";
import { SearchOptions } from "./components";

type Type = any;
type Props = JSX.ComponentProps & {
  [key: string]: any;
};
type Container = any;
type Instance = any;
type TextInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = any;

const debug = (...args: any[]) => {
  // console.log(args);
};

class HostConfig
  implements
    ReactReconciler.HostConfig<
      Type,
      Props,
      Container,
      Instance,
      TextInstance,
      HydratableInstance,
      PublicInstance,
      HostContext,
      UpdatePayload,
      ChildSet,
      TimeoutHandle,
      NoTimeout
    > {
  getPublicInstance(_instance: Instance | TextInstance) {
    // throw new Error("Method not implemented.");
  }
  getRootHostContext(_rootContainerInstance: Container): HostContext {
    return { type: "root" };
  }
  getChildHostContext(
    _parentHostContext: HostContext,
    type: Type,
    _rootContainerInstance: Container
  ): HostContext {
    return { type };
  }
  prepareForCommit(_containerInfo: Container): void {
    return;
  }
  resetAfterCommit(_containerInfo: Container): void {
    return;
  }
  createInstance(
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: OpaqueHandle
  ): Instance {
    if (props.toSlackElement) {
      return props.toSlackElement(
        props,
        e => {
          const [nodes, promises, onSearchOptions] = reconcile(
            e,
            rootContainerInstance.action,
            rootContainerInstance.getOnSearchOptions
          );

          if (
            nodes &&
            rootContainerInstance.action &&
            nodes.action_id === rootContainerInstance.action.value &&
            rootContainerInstance.getOnSearchOptions &&
            onSearchOptions
          ) {
            rootContainerInstance.onSearchOptions = onSearchOptions;
          }

          return [nodes, promises];
        },
        rootContainerInstance.promises
      );
    }

    throw Error("Unknown Component type " + JSON.stringify({ props, type }));
  }
  appendInitialChild(
    parentInstance: Instance,
    child: Instance | TextInstance
  ): void {
    debug("appendInitialChild");

    if (Array.isArray(parentInstance.blocks)) {
      parentInstance.blocks.push(child);
      return;
    }

    if (parentInstance.type === "overflow") {
      parentInstance.options.push(child);
      return;
    }

    if (
      parentInstance.type === "static_select" ||
      parentInstance.type === "multi_static_select"
    ) {
      if (child.isOptionGroup) {
        if (!Array.isArray(parentInstance.option_groups)) {
          parentInstance.option_groups = [];
        }

        parentInstance.option_groups.push(child);
        return;
      }

      if (!Array.isArray(parentInstance.options)) {
        parentInstance.options = [];
      }

      parentInstance.options.push({ ...child, url: undefined });
      return;
    }

    if (
      parentInstance.type === "checkboxes" ||
      parentInstance.type === "radio_buttons" ||
      parentInstance.isOptionGroup
    ) {
      parentInstance.options.push({ ...child, url: undefined });
      return;
    }

    if (parentInstance.type === "input") {
      parentInstance.element = child;
      return;
    }

    if (parentInstance.type === "actions") {
      parentInstance.elements.push(child);
      return;
    }

    if (parentInstance.type === "context") {
      parentInstance.elements.push(child);
      return;
    }

    if (parentInstance.isConfirm || parentInstance.isOption) {
      parentInstance.text = child;

      if (parentInstance.text.type === "text") {
        parentInstance.text.type = "plain_text";
      }
      return;
    }

    if (parentInstance.type === "button") {
      parentInstance.text.text += child.text;
      return;
    }

    if (parentInstance.type === "section") {
      if (!parentInstance.fields) {
        parentInstance.fields = [];
      }

      parentInstance.fields.push(child);
      return;
    }

    if (
      parentInstance.type === "mrkdwn" ||
      parentInstance.type === "plain_text"
    ) {
      parentInstance.text += child.text;

      return;
    }

    if (parentInstance.type === child.type) {
      parentInstance.text += child.text;
      return;
    }

    throw new Error(
      "appendInitialChild::" + JSON.stringify({ parentInstance, child })
    );
  }

  finalizeInitialChildren(
    _parentInstance: Instance,
    _type: Type,
    props: Props,
    rootContainerInstance: Container,
    _hostContext: HostContext
  ): boolean {
    if (
      rootContainerInstance.action &&
      props.action === rootContainerInstance.action.value
    ) {
      if (rootContainerInstance.getOnSearchOptions && props.onSearchOptions) {
        rootContainerInstance.onSearchOptions = props.onSearchOptions;
        return true;
      }

      if (props.onClick) {
        rootContainerInstance.promises.push(
          props.onClick(rootContainerInstance.action.event)
        );
      }

      if (props.onSubmit) {
        rootContainerInstance.promises.push(
          props.onSubmit(rootContainerInstance.action.event)
        );
      }

      if (props.onSelect) {
        rootContainerInstance.promises.push(
          props.onSelect(rootContainerInstance.action.event)
        );
      }

      return true;
    }

    return false;
  }
  prepareUpdate(
    _instance: Instance,
    _type: Type,
    _oldProps: Props,
    _newProps: Props,
    _rootContainerInstance: Container,
    _hostContext: HostContext
  ) {
    debug("prepareUpdate");
    return true;
  }
  shouldSetTextContent(_type: Type, _props: Props): boolean {
    return false;
  }
  shouldDeprioritizeSubtree(_type: Type, _props: Props): boolean {
    return false;
  }
  createTextInstance(
    text: string,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: OpaqueHandle
  ) {
    debug("createTextInstance");
    return {
      type: "text",
      text
    };
  }
  scheduleDeferredCallback(
    _callback: () => any,
    _options?: { timeout: number }
  ): any {}
  cancelDeferredCallback(callbackID: any): void {}
  setTimeout(
    _handler: (...args: any[]) => void,
    _timeout: number
  ): TimeoutHandle | NoTimeout {}
  clearTimeout(handle: TimeoutHandle | NoTimeout): void {}
  noTimeout: NoTimeout;

  now(): number {
    return Date.now();
  }
  isPrimaryRenderer: boolean;
  supportsMutation: boolean = true;
  supportsPersistence: boolean = false;
  supportsHydration: boolean = true;

  appendChildToContainer(
    container: Container,
    child: Instance | TextInstance
  ): void {
    if (container.isRoot) {
      container.node = child;
      return;
    }

    debug("appendChildToContainer");

    throw new Error("container is not an array");
  }

  appendChild(
    _parentInstance: Instance,
    _child: Instance | TextInstance
  ): void {
    debug("appendChild");
  }

  commitTextUpdate(
    textInstance: TextInstance,
    _oldText: string,
    newText: string
  ): void {
    debug("commitTextUpdate");
    textInstance.text = newText;
  }
  commitMount?(
    _instance: Instance,
    _type: Type,
    _newProps: Props,
    _internalInstanceHandle: Reconciler.Fiber
  ): void {
    debug("commitMount");
  }

  replaceContainerChildren?(container: Container, newChildren: ChildSet): void {
    debug("replaceContainerChildren", { container, newChildren });
  }
  resetTextContent(_instance: Instance) {
    debug("resetTextContent");
  }
  commitUpdate?(
    _instance: Instance,
    _updatePayload: UpdatePayload,
    _type: Type,
    _oldProps: Props,
    _newProps: Props,
    _internalInstanceHandle: OpaqueHandle
  ): void {}

  insertBefore?(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ): void {
    debug("insertBefore", { parentInstance, child, beforeChild });
  }

  insertInContainerBefore?(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ): void {
    debug("insertInContainerBefore", { container, child, beforeChild });
  }
  removeChild?(parentInstance: Instance, child: Instance | TextInstance): void {
    debug("removeChild", parentInstance, child);
  }
  removeChildFromContainer?(
    container: Container,
    child: Instance | TextInstance
  ): void {
    debug("removeChildFromContainer", {
      container,
      child
    });
  }
}

function reconcile(
  element: React.FunctionComponentElement<any>,
  action?: Action,
  getOnSearchOptions?: boolean
): [any, Promise<any>[], SearchOptions] {
  const reconcilerInstance = Reconciler(new HostConfig());
  const root: any = {
    isRoot: true,
    action,
    promises: new Array<Promise<any>>(),
    getOnSearchOptions
  };
  const container = reconcilerInstance.createContainer(root, false, false);

  reconcilerInstance.updateContainer(element, container, null, null);

  return [root.node, root.promises, root.onSearchOptions];
}

export async function render(
  element: React.FunctionComponentElement<any>,
  action?: Action
) {
  const [blocks, promises] = reconcile(element, action);

  await Promise.all(promises);

  return blocks;
}

export async function getOnSearchOptions(
  element: React.FunctionComponentElement<any>,
  action: Action
) {
  const [_, promises, onSearchOptions] = reconcile(element, action, true);

  await Promise.all(promises);

  return onSearchOptions;
}
