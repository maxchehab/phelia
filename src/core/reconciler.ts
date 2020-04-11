import Reconciler, { OpaqueHandle } from "react-reconciler";
import ReactReconciler from "react-reconciler";
import { SlackUser } from "./phelia-client";
import { InteractionEvent } from "./interactive-message-handler";

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
  getPublicInstance(instance: Instance | TextInstance) {
    // throw new Error("Method not implemented.");
  }
  getRootHostContext(rootContainerInstance: Container): HostContext {
    return { type: "root" };
  }
  getChildHostContext(
    parentHostContext: HostContext,
    type: Type,
    rootContainerInstance: Container
  ): HostContext {
    return { type };
  }
  prepareForCommit(containerInfo: Container): void {
    return;
  }
  resetAfterCommit(containerInfo: Container): void {
    return;
  }
  createInstance(
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: OpaqueHandle
  ): Instance {
    if (props.toSlackElement) {
      return props.toSlackElement(
        props,
        e => reconcile(e, rootContainerInstance.action),
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
    parentInstance: Instance,
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ): boolean {
    if (
      rootContainerInstance.action &&
      props.action === rootContainerInstance.action.value
    ) {
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
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ) {
    debug("prepareUpdate");
    return true;
  }
  shouldSetTextContent(type: Type, props: Props): boolean {
    return false;
  }
  shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
    // throw new Error("Method not implemented.");
    return false;
  }
  createTextInstance(
    text: string,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: OpaqueHandle
  ) {
    debug("createTextInstance");
    return {
      type: "text",
      text
    };
  }
  scheduleDeferredCallback(
    callback: () => any,
    options?: { timeout: number }
  ): any {
    // throw new Error("Method not implemented.");
  }
  cancelDeferredCallback(callbackID: any): void {
    // throw new Error("Method not implemented.");
  }
  setTimeout(
    handler: (...args: any[]) => void,
    timeout: number
  ): TimeoutHandle | NoTimeout {
    // throw new Error("Method not implemented.");
  }
  clearTimeout(handle: TimeoutHandle | NoTimeout): void {
    // throw new Error("Method not implemented.");
  }
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

  appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
    debug("appendChild");
  }

  commitTextUpdate(
    textInstance: TextInstance,
    oldText: string,
    newText: string
  ): void {
    debug("commitTextUpdate");
    textInstance.text = newText;
  }
  commitMount?(
    instance: Instance,
    type: Type,
    newProps: Props,
    internalInstanceHandle: Reconciler.Fiber
  ): void {
    debug("commitMount");
  }

  replaceContainerChildren?(container: Container, newChildren: ChildSet): void {
    debug("replaceContainerChildren", { container, newChildren });
  }
  resetTextContent(instance: Instance) {
    debug("resetTextContent");
  }
  commitUpdate?(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: OpaqueHandle
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

interface Action {
  value: string;
  event: InteractionEvent;
}

function reconcile(
  element: React.FunctionComponentElement<any>,
  action?: Action
): [any, Promise<any>[]] {
  const reconcilerInstance = Reconciler(new HostConfig());
  const root: any = {
    isRoot: true,
    action,
    promises: new Array<Promise<any>>()
  };
  const container = reconcilerInstance.createContainer(root, false, false);

  reconcilerInstance.updateContainer(element, container, null, null);

  return [root.node, root.promises];
}

export async function render(
  element: React.FunctionComponentElement<any>,
  action?: Action
) {
  const [blocks, promises] = reconcile(element, action);

  await Promise.all(promises);

  return blocks;
}
