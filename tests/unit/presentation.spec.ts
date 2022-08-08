import { shallowMount, VueWrapper } from "@vue/test-utils";
import BaseButton from "@/components/presentation/BaseButton.vue";
import BaseCheckbox from "@/components/presentation/BaseCheckbox.vue";

describe("BaseButton.vue", () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper = shallowMount(BaseButton);
  });
  it("renders props.displayName when passed", async () => {
    const displayName = "テスト";
    // const wrapper = shallowMount(BaseButton, {
    //   props: { displayName },
    // });
    await wrapper.setProps({
      displayName: displayName,
    });
    expect(wrapper.find("button").text()).toBe("テスト");
  });
  it("emits an event when clicked", async () => {
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});

describe("BaseCheckbox.vue", () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper = shallowMount(BaseCheckbox, {
      props: {
        id: "checkbox1",
        label: "チェックしてね",
      },
    });
  });
  it("renders props.label when passed", () => {
    expect(wrapper.find("label").text()).toBe("チェックしてね");
  });
  it("id of input is correctly reflected", () => {
    const target = wrapper.find("input");
    expect(target.attributes().id).toBe("checkbox1");
  });
  it("for of label is correctly reflected", () => {
    const target = wrapper.find("label");
    expect(target.attributes().for).toBe("checkbox1");
  });
  it("emitが正しく行われているか~false版~", async () => {
    const target = wrapper.find("input");
    target.trigger("change");
    expect(wrapper.emitted("update:modelValue")).toBeDefined();
    expect(wrapper.emitted("update:modelValue")?.[0][0]).toBe(false);
  });
  it("emitが正しく行われているか~true版~", async () => {
    const target = wrapper.find("input");
    await target.setValue(true);
    target.trigger("change");
    expect(wrapper.emitted("update:modelValue")).toBeDefined();
    expect(wrapper.emitted("update:modelValue")?.[0][0]).toBe(true);
  });
});
