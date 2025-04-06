<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold text-gray-200 mb-6">配置穿透</h2>
      <!-- 配置表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-[#2a2a2a] text-gray-200 rounded-lg shadow-md">
          <thead>
            <tr class="w-full bg-gray-700 text-left">
              <th class="py-3 px-4">子域</th>
              <th class="py-3 px-4">域名</th>
              <th class="py-3 px-4">类型</th>
              <th class="py-3 px-4">本地地址</th>
              <th class="py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(config, index) in configs"
              :key="index"
              class="border-b border-gray-600"
            >
              <td class="py-2 px-4">
                <input
                  v-model="config.subdomain"
                  type="text"
                  placeholder="请输入子域"
                  class="w-full bg-gray-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  :disabled="isProcessing || config.submitted"
                />
              </td>
              <td class="py-2 px-4">
                <select
                  v-model="config.domain"
                  class="w-full bg-gray-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  :disabled="isProcessing || config.submitted"
                >
                  <option
                    v-for="domain in domainList"
                    :key="domain"
                    :value="domain"
                  >
                    {{ domain }}
                  </option>
                </select>
              </td>
              <td class="py-2 px-4">
                <select
                  v-model="config.type"
                  class="w-full bg-gray-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  :disabled="isProcessing || config.submitted"
                >
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="ssh">SSH</option>
                </select>
              </td>
              <td class="py-2 px-4">
                <input
                  v-model="config.localAddress"
                  type="text"
                  placeholder="请输入本地地址"
                  class="w-full bg-gray-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  :disabled="isProcessing || config.submitted"
                />
              </td>
              <td class="py-2 px-4 text-center">
                <!-- 未提交显示提交按钮；提交后显示删除按钮 -->
                <button
                  v-if="!config.submitted"
                  @click="submitConfig(index)"
                  :disabled="isProcessing || !isConfigValid(config)"
                  class="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white px-4 py-2 rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  提交
                </button>
                <button
                  v-else
                  @click="deleteConfig(index)"
                  :disabled="isProcessing"
                  class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 添加配置按钮，只允许所有现有配置已提交后新增 -->
      <div class="mt-4 flex justify-end">
        <button
          @click="addConfig"
          :disabled="!canAddConfig || isProcessing"
          class="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加配置
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  
  const route = useRoute();
  const tunnelId = route.query.id;
  
  const state = reactive({
    apiToken: null,
    accountId: null,
    email: null,
    loading: false,
  });
  
  const isProcessing = ref(false);
  const configs = ref([]);
  const domainList = ref([]);
  
  // 验证配置是否完整
  const isConfigValid = (config) => {
    return (
      config.subdomain.trim() !== '' &&
      config.domain.trim() !== '' &&
      config.type.trim() !== '' &&
      config.localAddress.trim() !== ''
    );
  };
  
  // 仅当所有配置都已提交时，允许新增配置
  const canAddConfig = computed(() => {
    return configs.value.every((config) => config.submitted);
  });
  
  const fetchDomainList = async () => {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones?per_page=100`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('获取域名列表失败');
      const data = await response.json();
      domainList.value = data.result.map((domain) => domain.name);
    } catch (error) {
      ElMessage.error('获取域名列表失败');
      console.error(error);
    }
  };
  
  const fetchExistingConfigs = async () => {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${state.accountId}/cfd_tunnel/${tunnelId}/configurations`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('查询隧道配置失败');
      const data = await response.json();
      // 返回结构： { result: { config: { ingress: [ ... ] } } }
      return data.result.config.ingress || [];
    } catch (error) {
      ElMessage.error('获取隧道配置失败');
      console.error(error);
      return [];
    }
  };
  
  const submitConfig = async (index) => {
    const config = configs.value[index];
    if (!isConfigValid(config)) {
      ElMessage.error('请填写完整配置');
      return;
    }
    isProcessing.value = true;
    // 构造完整域名和 service 字段
    const hostname = `${config.subdomain}.${config.domain}`;
    let service = '';
    if (config.type === 'http' || config.type === 'https') {
      service = `${config.type}://${config.localAddress}`;
    } else if (config.type === 'ssh') {
      service = `ssh://${config.localAddress}`;
    }
    // 构造 payload：将当前配置加入，同时保留其他已提交配置（如果有）；
    // 同时始终追加最后的 fallback 配置
    const submittedRules = configs.value
      .filter((c) => c.submitted)
      .map((c) => {
        const h = `${c.subdomain}.${c.domain}`;
        let s = '';
        if (c.type === 'http' || c.type === 'https') {
          s = `${c.type}://${c.localAddress}`;
        } else if (c.type === 'ssh') {
          s = `ssh://${c.localAddress}`;
        }
        return {
          hostname: h,
          service: s,
          originRequest: {}
        };
      });
    // 添加当前新提交的规则
    submittedRules.push({
      hostname,
      service,
      originRequest: {}
    });
    // 添加 fallback 配置
    submittedRules.push({ service: "http_status:404" });
  
    const payload = { config: { ingress: submittedRules } };
  
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${state.accountId}/cfd_tunnel/${tunnelId}/configurations`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('提交配置失败');
      config.submitted = true;
      await loadConfigs();
      ElMessage.success('配置提交成功');
    } catch (error) {
      ElMessage.error('配置提交失败');
      console.error(error);
    } finally {
      isProcessing.value = false;
    }
  };
  
  const deleteConfig = async (index) => {
    isProcessing.value = true;
    // 过滤出要保留的配置（删除指定项后，其余已提交配置）
    const remainingConfigs = configs.value.filter(
      (_, idx) => idx !== index && _.submitted
    );
    // 构造新的 ingress 规则
    const updatedRules = remainingConfigs.map((c) => {
      const h = `${c.subdomain}.${c.domain}`;
      let s = '';
      if (c.type === 'http' || c.type === 'https') {
        s = `${c.type}://${c.localAddress}`;
      } else if (c.type === 'ssh') {
        s = `ssh://${c.localAddress}`;
      }
      return {
        hostname: h,
        service: s,
        originRequest: {}
      };
    });
    // 始终追加 fallback 配置
    updatedRules.push({ service: "http_status:404" });
    const payload = { config: { ingress: updatedRules } };
  
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${state.accountId}/cfd_tunnel/${tunnelId}/configurations`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('删除配置失败');
      // 删除成功后更新本地数据
      configs.value.splice(index, 1);
      await loadConfigs();
      ElMessage.success('配置删除成功');
    } catch (error) {
      ElMessage.error('配置删除失败');
      console.error(error);
    } finally {
      isProcessing.value = false;
    }
  };
  
  const addConfig = () => {
    if (canAddConfig.value) {
      configs.value.push({
        subdomain: '',
        domain: '',
        type: 'http',
        localAddress: '',
        submitted: false,
      });
    }
  };
  
  const loadConfigs = async () => {
    const existing = await fetchExistingConfigs();
    if (existing.length > 0) {
      // 仅加载提交过的配置
      configs.value = existing
        .filter((item) => item.hostname && item.service && item.service !== "http_status:404")
        .map((item) => {
          const hostname = item.hostname || '';
          const [subdomain, ...rest] = hostname.split('.');
          const domain = rest.join('.') || '';
          let type = 'http';
          let localAddress = item.service || '';
          if (localAddress.startsWith('https://')) {
            type = 'https';
            localAddress = localAddress.replace('https://', '');
          } else if (localAddress.startsWith('http://')) {
            type = 'http';
            localAddress = localAddress.replace('http://', '');
          } else if (localAddress.startsWith('ssh://')) {
            type = 'ssh';
            localAddress = localAddress.replace('ssh://', '');
          }
          return {
            subdomain,
            domain,
            type,
            localAddress,
            submitted: true,
          };
        });
    }
  };
  
  onMounted(async () => {
    const config = await window.electronAPI.getConfig();
    if (!config) {
      ElMessage.error('配置文件未找到，请检查设置');
      return;
    }
    state.apiToken = config.token || null;
    state.accountId = config.userId || null;
    state.email = config.email || null;
  
    fetchDomainList();
    await loadConfigs();
  });
  </script>
  
  <style scoped>
  /* 额外的自定义样式 */
  </style>
  