import { shallowMount, VueWrapper } from "@vue/test-utils";
import BaseButton from "@/components/presentation/BaseButton.vue";

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
