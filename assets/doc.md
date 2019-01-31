# 用户手册
## Dashboard

**本节索引：**  
- [全局监控](#moni)
- [资源监控](#resource)
- [服务监控](#api)
- [应用引擎](#k8s)
- [功能监控](#fun)


### <span id = "moni">全局监控</span>

全局监控是对平台中的资源、集群、租户、用户、服务等监控数据进行的统计。全局监控包括所有环境和所有租户，不区分租户和环境。

![guide-qjjk](assets/images/doc/guide-qjjk.jpg)

- 资源情况：平台管理的集群与主机数量及CPU、内存使用统计；
- 租户用户：平台中的租户和用户数量统计；
- 应用：平台中的应用数量统计；
- 服务：平台中的服务总数统计；

![guide-clusterinfo](assets/images/doc/guide-clusterinfo.jpg)

集群信息中显示平台中的所有集群信息。点击集群名称可查看该集群下的详细信息，包括CPU、内存、应用、中间件的总量，以及集群下的主机资源使用情况。  
点击主机前面的 **+** 按钮，可展开主机，下面显示该主机上部署的应用及中间件，将鼠标放到应用或中间件名称上，悬浮显示该应用或中间件的资源使用情况。  
点击主机名，可打开主机监控页，展示该节点的资源监控数据。

![guide-tenantlist](assets/images/doc/qjdh-tenant.jpg)

租户列表中显示平台中的所有租户信息，包括租户管理员、租户下的用户、应用、中间件、服务总量，以及租户的配额及使用情况。  

### <span id = "resource">资源监控</span>

资源监控显示登录用户所在的租户的资源使用情况。

![guide-resmonit](assets/images/doc/guide-resmonit.jpg)

- 主机状态：显示当前租户可使用集群数量及主机状态统计；  
- 应用状态：显示当前租户在当前环境中的应用总数及状态；
- 访问量：显示当前租户在当前环境中的所有应用最近一周内页面访问总量，只显示通过域名访问的数据；
- 用户数：显示当前租户在当前环境中的所有应用最近一周内访问凭证创建总数

下方显示的当前租户所拥有的集群信息，和全局监控中的集群信息一样，只是这里只显示当前租户所拥有的集群。集群中显示该集群的资源使用情况，该集群下的主机信息，以及主机下的应用情况。

### <span id = "api">服务监控</span>

服务监控显示对当前租户下的服务的监控情况。

![guide-servicemoni](assets/images/doc/guide-servicemoni.jpg)

### <span id = "k8s">应用引擎</span>

应用引擎中显示k8s集群的资源使用情况。

![guide-servicemoni](assets/images/doc/cce-moni.jpg)

### <span id = "fun">功能监控</span>

功能监控是对系统中的功能的使用情况的统计。包括功能总数、近期被访问功能总数、功能访问总次数、使用次数最高的功能Top20、使用用户数最多的功能Top20等。

![guide-servicemoni](assets/images/doc/functionmoni.jpg)


## 应用管理

**本节索引：**  
- [应用列表](#add-list)
- [新建应用](#add-app)
    - [通过镜像方式创建](#createapp-image)
    - [通过war方式创建](#createapp-war)
    - [外部应用接入](#createapp-outer)
- [应用详情](#app-detail)
    - [概览](#app-overview)
    - [部署](#app-deploy)
    - [认证](#app-oauth)
    - [权限](#app-authority)
    - [服务](#app-service)
    - [日志](#app-logs)
    - [事务](#app-transactions)
    - [设置](#app-setting)
- [应用启动\停止](#app-stop)
 

### <span id = "add-list">应用列表</span>
我们的平台是分租户和环境的，平台中可以包括多个租户，一个租户可以对应多个环境。一个应用只会存在于一个租户下的一个环境中；  
应用运行环境一般分为：开发环境、测试环境、生产环境，也可以更多，在高级设置中进行设置。  
在页面右上角，显示当前登录用户名和我们当前的环境，下方环境中显示用户所在租户有权限的所有环境信息，点击环境名称可切换到不同的环境。切换环境后，应用列表中显示该环境下的当前登录用户有权限看到的应用信息。

![guide-applist](assets/images/doc/guide-applist.jpg)

列表最上方显示应用状态的统计，包括 **运行中**、**异常**、**失败**。
列表上方显示查询条件框，可以通过 **名称**、 **标签**、 **状态** 对列表中的数据进行过滤。  
列表中的应用分为云部署应用和外部接入应用两种，如果是部署在我们平台上的，则列表中应用会显示集群、镜像、实例个数。如果不是部署在我们平台上的应用则这些信息不会显示。  

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>登录用户不同，在应用列表中看到的应用也会不同。用户只能看到自己可管理的应用，如果登录用户为admin或者具有平台管理员角色，则该用户可以看到所有的应用信息。</p>
</div>

### <span id = "add-app">新建应用</span>

在应用列表中，显示当前租户在当前环境下的所有应用信息。  
应用部署支持多种方式，您可以选择适合自己的方式。包括 **镜像部署**、 **程序包部署**、 **外部应用接入** 三种方式。  
新建应用采用向导方式，简单易用。下面分别介绍：

#### <span id = "createapp-image">一、通过镜像方式创建</span>
我们可以直接通过仓库中的Docker镜像的方式来创建应用。  
点击 **新建**, 填写基本信息-设置部署信息-完成，完成应用的创建。   
操作过程如下所示：

![images-demo](assets/images/doc/images-demo.gif)

具体操作步骤下面详细介绍：    
**步骤一：基本信息**

在应用列表中，点击 **新建** 按钮，打开新建应用基本信息页。  
![guide-addapp1](assets/images/doc/guide-addapp1.jpg)
- **应用名称：** 必填项，可以任意填写应用名称；  
- **应用code：** 必填项，应用的标识，只能输入数字、小写字母、横线，且不能以横线开头或结尾;  
- **分类标签：** 为应用打上标签，可以为一个或者多个，在应用列表中可以通过标签过滤，可选项；  
- **应用类型：** 包括web类型和app类型；  
- **运行环境：** 默认显示当前用户所在的环境；  
点击 **下一步**跳转到部署信息页。

**步骤二：部署信息**

![guide-addapp2](assets/images/doc/guide-addapp2.jpg)
- **部署方式：** 默认选中镜像；  
- **部署集群：** 下拉框，显示本租户在集群中配置的集群信息；  
- **部署副本数：** 表示创建的应用的实例的个数。多副本自动负载均衡，您可以根据实际应用来选择副本个数；  
然后点击**添加容器**按钮，可打开添加容器页面，如下图所示。添加容器包括三个步骤：选择镜像、部署配置、高级配置。  

**选择镜像：** 

![guide-adddockerjpg](assets/images/doc/guide-adddockerjpg.jpg)    
镜像包括我的镜像、平台镜像，以及自定义镜像。  
其中：  
- **我的镜像:** 显示当前登录用户所在的租户下的镜像信息；  
- **平台镜像:** 显示租户c2cloud下的镜像信息；  
- **自定义镜像:** 需要自己输入镜像地址，如果镜像为私有镜像，则需要权限才能下载。  

点击要选择的镜像后面的 **选择** 按钮直接选择该镜像的最新版本，点击![guide-chooseimage](assets/images/doc/guide-chooseimage.jpg)，可显示该镜像的所有版本信息，点击要选择的版本，选择好镜像。  
在镜像列表上方，我们可以通过镜像分类和镜像名称对列表中的镜像进行过滤。   
<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>在平台镜像分类中只显示基础组件和业务组件。</p>
</div>

<span id = "deploy">**部署配置**</span>：

![guide-choosedocker](assets/images/doc/guide-choosedocker.jpg)
- **镜像地址：** 显示上面选择的镜像的地址信息，不可修改；   
- **容器名称：** 容器的名称，不支持中文。只支持小写英文字母、数字、中划线；  
- **资源配置：** 对当前容器进行cpu及内存的限制。根据实际应用需要配置；  

点击**确定**完成容器的添加，一个应用可以添加多个容器。选择容器后，点击**删除**按钮可删除选中的容器。  

**步骤三：完成**

应用创建完成后，显示“应用创建成功”，点击**查看应用详情**可跳转到该应用的应用详情页，点击**返回应用列表**可返回应用列表。
![guide-addappfinish](assets/images/doc/guide-addappfinish.jpg)

#### <span id = "createapp-war">二、通过war包方式创建</span>

我们同样支持war包方式部署应用。您只需要上传您的war包，我们系统将自动将您上传的war包编译成镜像。

![war-demo](assets/images/doc/war-demo.gif)

**步骤一：基本信息**

在应用列表中点击 **新建** 按钮，打开应用的基本信息页，具体操作请参考  。  

**步骤二：部署信息**

![guide-war](assets/images/doc/guide-war.jpg)   
- **部署方式：** 选择**程序包**方式；  
- **部署集群：** 下拉框，显示本租户在集群中配置的集群信息，选择要将应用部署到的集群；  
- **部署副本数：** 表示创建的应用的实例的个数。根据实际应用使用需要配置；

然后，点击**自定义镜像**按钮，打开添加容器页。添加容器同样包括 **选择镜像**、**部署配置**、**高级配置**三步。  

**选择镜像**

![guide-addwar](assets/images/doc/guide-addwar.jpg)
- **程序包类型：** 暂只支持war类型；  
- **镜像名称：** 镜像的名称，任意取；  
- **镜像版本：** 定义镜像的版本号，下方显示该应用已经存在的最新的版本号；  
- **镜像分类：** 下拉框，选择镜像的分类；  
- **上传程序包：** 点击该按钮，将war包上传；  
- **Dockerfile：** 定义dockerfile内容。将war包打成镜像的dockerfile内容如下：  
 ```
FROM registry.c2cloud.cn/library/tomcat8:latest

MAINTAINER Vurt <yilin.yan@chinacreator.com>

COPY $warfile /opt/tomcat/webapps/ROOT.war

# Launch Tomcat
CMD ["/opt/tomcat/bin/catalina.sh", "run"]
 ```
配置完成后，点击**提交编译**按钮，显示“正在编译中”，war包上传完成后，页面跳转到下一步。编译任务在镜像管理中的任务列表中可以查看具体的日志信息。

**部署配置**

具体配置请参考 [**部署配置**](#deploy)

**完成**



#### <span id = "createapp-outer">三、外部应用接入</span>

如果要接入的应用已在其它地方已经部署好了，那么我们就可以以这种方式来创建应用，将应用接入平台中来。  

![testdemo](assets/images/doc/testdemo.gif)

**步骤一：基本信息**

在应用列表中点击 **新建** 按钮，打开应用的基本信息页，具体操作请参考  。  

**步骤二：部署信息**

![guide-outapp](assets/images/doc/guide-outapp.jpg)

- **部署方式：** 选择外部应用接入；

然后，点击 **新增应用地址** 按钮，添加应用访问地址IP和PORT，可添加多个访问地址。如果应用存在上下文，则在 **上下文** 后面的文本框中输入上下文呢信息。点击 **创建** 按钮，完成应用的创建。  

### <span id = "app-detail">应用详情</span>

在应用列表中，点击应用名称或者操作栏中的 **管理** 进入应用详情页，如下图所示。

![guide-appdetails](assets/images/doc/guide-appdetails.jpg)

在页面上方显示应用的基本信息。</br>
- **应用名：** 显示应用的名称，点击可以修改；</br>
- **应用标签：** 显示应用标签，点击后面的 **+** 可为应用添加标签，点击标签后面的 **×** 可删除标签；</br>
- **创建人：** 显示应用的创建人，不可修改；</br>
- **创建时间：** 显示创建该应用的时间，不可修改；</br>
- **CODE:** 显示应用的CODE，如果该应用为云部署的应用；</br>
- **所属集群：** 显示应用所属的集群，点击可进行集群迁移。通过迁移功能，您可以在不同的集群间调节应用部署的位置，老的应用会被删除，新的应用会在目标集群重新启动。</br>
- **应用副本：** 显示该应用的副本数，点击可以进行副本数的修改。平台支持多副本应用的自动负载均衡，您可以根据实际环境调节应用部署的副本个数。</br>
- **系统管理员：** 点击后面的**未指定**可打开系统管理员设置页，指定系统管理员.负责管理和分配应用内用户的角色，负责维护与系统运行相关的各类配置和参数，维持系统的软硬件正常运转。</br>
- **特性：** 默认显示 web、系统应用、统一认证、Spring Cloud、性能监控、HA高可用六个特性。如果开启了某一特性，则这里对应的特性高亮显示；</br>
- **描述：** 默认显示为空，点击可编辑描述信息；</br>

在详情页下的下方，显示 **概览**、**部署**、**认证**、**权限**、**服务**、**日志**、**事务**、**设置**等TAB页，点击不同的页签可查看相应的内容。

#### <span id = "app-overview">概览</span>

概览中显示应用的健康状况、访问量、访问人数、持续运行时长，以及性能监控和资源监控情况，如下图所示：

![guide-appinfo](assets/images/doc/guide-appinfo.jpg)

- 健康状况：最近一周内应用及所提供服务的运行状况；
- 访问量：域名访问方式下的应用页面访问总量；
- 访问人数：域名访问方式下的应用凭证创建总数；
- 持续运行时长：显示应用最近一次启动到当前的时间；
- 性能监控：只有开启了性能监控，这里还会显示监控数据，包括链路拓扑、请求耗时分布、应用响应时间分布，以及TOP10响应慢服务。点击右上角的时间选择框可选择显示哪个时间段的监控数据；
- 资源监控：只有在我们平台部署的应用，这里才会显示资源监控数据，包括CPU负载、内存、网络、存储等监控数据。

#### <span id = "app-deploy">部署</span>

**镜像版本切换**

**所属镜像** 后面显示该应用使用的镜像名称，鼠标放到名称上面显示该镜像具体的地址信息；  
**版本** 后面显示该镜像的版本信息。  
如果应用需要升级版本，我们只需要点击 **版本** 后面的编辑按钮，打开切换版本页，进行版本切换就可以了。

![image-version](assets/images/doc/image-version.gif) 

**容器资源限制**

这里是指定该应用所能使用的资源上限，包括 CPU 和 内存两种资源，防止占用过多资源。  
如果我们要对应用容器的资源进行限制，点击 **基本配置** 后面的 **编辑** 按钮，打开基本配置修改页，如上面镜像版本切换中的图所示，选择要限制的配额方案，点击 **确定** 即可完成容器资源限制。

![image-version](assets/images/doc/guide-modifydocker.jpg) 


**健康检查**

![healthcheck](assets/images/doc/healthcheck.gif)

在基本配置页中，点击健康检查后面的开关![guide-healthcheck](assets/images/doc/guide-healthcheck.jpg)，可打开健康检查开关。如下图所示：

![guide-healthsetting](assets/images/doc/guide-healthsetting.jpg)
- **端口：** 指进行健康检查的端口，可以是容器端口，也可以是实际应用的专门做健康检查的端口。根据实际镜像配置；  
- **初始延时：** 指容器在开始启动时到第一次健康的时间间隔，需要根据时间容器启动耗时做配置；  
- **周期：** 指两次健康检查的时间间隔，需要根据实际容器的运行状态配置；  
- **接口：** 指进行健康检查的接口信息。

**共享许可**

每个租户下的所有应用可以共享许可，首先我们需要在 **高级设置**-**许可信息**中上传license。然后在应用详情中的 **部署** 页中点击![guide-showlic](assets/images/doc/guide-showlic.jpg)开关，开启共享许可。  
如果license过期，则只需要替换许可信息中的license即可，不需要一个应用一个应用的替换了。   
<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>应用能进行共享许可必须满足以下条件：</br> 1. runtime版本不小于5.0.3.3 </br> 2. c2-cce-console版本不低于v2.2.3</br> 3. c2-cce-applications版本不低于v2.1</p>
</div>

**网络配置**

网络配置包括集群内地址配置和集群外地址配置。在网络配置下，点击 **添加网络配置** 按钮，可添加网络配置，如下图所示：  
![guide-networksetting](assets/images/doc/guide-networksetting.jpg)
- **容器端口：** 输入需要配置的容器端口，如tomcat的端口默认就是8080。  
- **协议：** 选择相应的协议，支持TCP和UDP协议；  
- **集群内地址：** 只有开放后，集群内的其它应用才能够访问到，端口号需要手动配置；一般情况和容器端口一致。如果选择为关闭，则只有当前应用可以访问，集群内地址显示为127.0.0.1；
- **集群外地址：** 只有开放后，集群外的机器才能访问到，端口号必须在【30000，32767】之间，可以为空，如果为空则系统会自动分配一个30000以上32767以下的端口；比如一个web应用需要被其他用户访问，那么需要开放集群外端口，如集群外端口为30001，则集群外机器就可以通过http://node:30001 访问该应用了。

保存后，地址显示为IP:Port形式，其中IP为集群内的任意一个主机的IP。重启应用后，这个IP可能会变为集群内的其它主机IP，只要在同一个集群中，使用集群中任意主机的IP加上这里配置的集群外端口号都可以访问。  

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>此步骤为必须操作，所有应用都必须进行网络配置。</p>
</div>
 

**环境变量**

对于支持环境变量的应用，我们可以将配置文件c2-config.properties中配置的环境变量配置出来。这样我们要修改环境变量的值也方便。启动容器时，优先读这里配置的环境变量信息。  
![guide-envvalue](assets/images/doc/guide-envvalue.jpg)

环境变量我们可以通过 **添加** 和 **导入** 两种方式来添加。点击环境变量下面的 **添加** 按钮，在环境变量中添加一行，第一个文本框中填环境变量的参数名，后面文本框中输入环境变量参数对应的值。一个应用可以添加多个环境变量。  
当要添加的环境变量较多时，我们可以直接点击 **导入** 按钮，打开环境变量导入页，导入页中一行输入一个环境变量，格式为：xxx=yyy(变量名=变量值)，也可以将要导入的内容从其他环境中拷贝过来，直接粘贴到环境变量后的文本框中，修改相关值后，点击 **保存** 按钮，即可将环境变量导入。   
![guide-envimp](assets/images/doc/guide-envimp.jpg)

**关联中间件**

在这里我们可以为应用关联中间件，点击 **新增** 按钮，可打开关联中间件页，如下图所示。  
![guide-envvalue](assets/images/doc/guide-app-middleware.jpg)  
应用关联中间件后，中间件的连接信息自动加到应用环境变量中，修改中间件信息后，应用中的关联中间件信息自动修改。（该功能暂未实现）

**存储卷**

应用默认是不会挂在存储卷的，为了保证容器在停止后数据不丢失，我们可以将应用的数据挂载在持久化存储上。   
![create-vol](assets/images/doc/create-vol.gif)

在应用下的部署TAB页中，点击存储卷下面的 **添加** 如下图所示：  
![guide-vol](assets/images/doc/guide-vol.jpg)

在存储卷下面添加一行，点击存储卷后面的下拉框，显示本租户下状态为“未挂载”的存储卷，我们可以直接选择。我们也可以点击 **创建存储卷** 项，来新增存储卷。

![guide-createvol](assets/images/doc/guide-createvol.jpg)
- **名称：** 存储卷名称，在nfs服务器上会同时创建一个同名称的文件夹。
- **容量：** 存储卷实际存储大小，可支持10G，20G，40G，80G，100G，下拉选择。
存储卷创建完成后，在存储卷中进行配置：
- **名称：** 显示上面创建的存储卷名称或者选择的存储卷名称；
- **挂载路径：** 需要挂载出去的路径， 系统会将该目录下的内容挂载到nfs同名称的文件夹下；
- **最大容量：** 显示创建存储卷配置的容量；

点击 **保存** 即可完成挂载。点击 **取消挂载** 可解挂。

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>1. 如果要添加多个存储卷数据，可多次点击添加按钮；</br> 2. 我们可以对存储卷进行新增、修改，以及删除操作，当数据变更后，应用都将会重启。</br> 3. 目录一旦挂载，该路径下原有文件将不再生效，您也无法找到它们。</br> 4. 存储卷挂在完成后，需要重启应用方可生效。 </p>
</div>

**配置文件**

对容器中的配置文件，我们也可以通过配置配置文件来进行修改。在容器配置页中，点击配置文件下的 **添加** 按钮，打开新增配置文件页，如下图所示：
![guide-config](assets/images/doc/guide-config.jpg)
- **挂载路径：** 填写配置文件的绝对路径；  
- **文件内容：** 输入配置文件的内容；

点击 **确定** 按钮，完成配置文件的修改。保存后，该配置文件内容将修改为这里输入的内容。

**启动命令**

对于容器，我们还可以配置启动命令。在启动容器的时候会先执行这里配置的启动命令。  
在应用部署页中，在启动命令后的文本框中输入启动命令。  
![guide-startcmd](assets/images/doc/guide-startcmd.jpg)

#### <span id = "app-oauth">路由&认证</span>

**路由**

在路由列表中添加域名配置。此步骤需要先在系统设置中设置好路由地址及模板。  
点击 **添加域名配置** 按钮，在路由列表中添加一行.

- 路由模板：点击路由模板下拉框，显示在系统设置中配置好的模板，选择一个要用的模板，模板选择好后，域名列显示模板定义的域名格式；
- 域名：按照格式输入要配置的域名；
- 域名上下文：如果有上下文则输入上下文信息；
- 裁剪上下文：比如你配了一个上下文的域名：amp.c2cloud.cn/test，如果开启了域名裁剪，这个test在路由转发的时候，会被裁剪（也就是丢弃），转发到服务器上会变成amp.c2cloud.cn/

点击 **保存** 按钮即可。

![guide-startcmd](assets/images/doc/guide-luyou.jpg)

**集群：**

这里主要是用来配置应用和服务的后端集群信息，调整负载均衡策略。  
点击集群下的 **新增** 按钮，在集群列表中新增一行，点击IP下的文本框，显示应用集群外地址，可直接选择，也可以手动输入。端口为应用集群外的端口号。如果存在多台服务器，则系统会按照设置的权重大小来进行调配。  
![guide-cluster.jpg](assets/images/doc/guide-cluster.jpg)   

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>这里为必填项，如果应用为外部接入的应用，在创建应用时填了IP和端口号，系统会自动将这个IP和端口号填到集群这里。如果为云部署的应用，则需要将集群外的IP和端口号填到这里。</p>
</div>


**统一认证**

如果应用要接入应用管理平台的统一认证，则需要开启统一认证开关![guide-authcheck](assets/images/doc/guide-authcheck.jpg)，打开统一认证配置页，如下图所示：  
![guide-authconfig](assets/images/doc/guide-authconfig.jpg)
- **凭证有效时间：** 这里的有效时间为应用凭证（AccessToken）在服务端的过期时间；
- **刷新凭证有效时间：** 刷新凭证有效时间为应用刷新凭证（RefreshToken）在服务端的过期时间；
- **安全等级：** 包括普通、中级、高安全级。如果安全级别设置为“高”，则RefreshToken失效时需要重新登录；
- **认证回调地址：** 输入认证的回调地址，即应用的访问地址；
- **自定义登录页：**    

点击 **确定** 完成配置，完成后，显示如下：  
![guide-auth](assets/images/doc/guide-auth.jpg)



如果应用启用了统一认证，那么我们还需要对应用进行统一认证的配置。  
统一认证配置分以下两种情况：   
**第一种情况：** 应用不是通过应用管理平台部署的，则我们需要在应用的web.xml里面进行认证配置。如下图所示：
 ```
<init-param>
            <param-name>clientId</param-name>
            <param-value></param-value>
        </init-param>
        <init-param>
            <param-name>clientSecret</param-name>
            <param-value></param-value>
        </init-param>
        <init-param>
            <param-name>authrizationServerUrl</param-name>
            <param-value></param-value>
        </init-param>
        <init-param>
            <param-name>clientUrl</param-name>
            <param-value></param-value>
        </init-param>
 ```
其中：  
- clientId：就是“认证配置”页中显示的客户端ID；  
- clientSecret：就是客户端凭证；  
- authrizationServerUrl：是应用集成平台地址；  
- clientUrl：就是认证回调地址。  

**第二种情况：** 应用是通过应用管理平台来部署的，则我们只需要在平台中对应的应用下添加下面几个环境变量即可，具体对应的值和上面一致。
```
c2_sso_client_clientid=2
c2_sso_client_clientsecret=2
c2_sso_client_authrizationserverurl=http://172.17.87.38:30647
c2_sso_client_clienturl=http://172.16.70.1:32375
```
其中：   
- c2_sso_client_clientid=客户端ID
- c2_sso_client_clientsecret=客户端凭证
- c2_sso_client_authrizationserverurl=应用集成平台地址
- c2_sso_client_clienturl=认证回调地址  

**应用的机构用户数据权限**

这里只有开启了统一认证才会显示。用来设置该应用对分类机构的读写权限，和在机构用户维度页中设置是一样的。点击后面的 **修改** 按钮，可打开机构与读写权限设置页，如下图所示：  
![guide-auth](assets/images/doc/app-metaschoose.jpg)

在机构与读写权限设置页中，显示所有的分类机构信息，读写权限包括拒绝、只读，以及读写三种，默认勾选拒绝。  
**拒绝** 则表示该应用不可使用该分类机构的数据；   
**只读** 则表示该应用可以对该分类机构下的数据进行查询；  
**读写** 则才能够对该分类机构下的数据进行读写操作。勾选后直接生效。

**可访问应用的用户列表**

这里显示允许访问应用的用户，只有显示在这里的用户才能访问该应用。  

![guide-auth](assets/images/doc/guide-appusers.jpg)


#### <span id = "app-oauth">权限</span>

**角色管理**

应用角色按类型可以分为缺省角色和定制角色两类，其中缺省角色是应用默认角色，定制角色则是应用业务角色，角色的查询服务由管理门户统一提供。  
点击角色下方的 **新增** 按钮，打开新增角色页，如下图所示：  
![guide-addrole](assets/images/doc/guide-addrole.jpg)   

我们平台中默认有以下角色：    
1 **平台管理员角色：** 平台管理员默认有平台所有的权限；   
2 **功能管理员角色：** 功能管理员默认拥有功能和全局导航功能，但功能管理员只能看到自己可管理的功能信息；   
3 **租户管理员角色：** 租户管理员拥有可管理租户下的所有功能权限；   
4 **机构管理员角色：** 拥有机构管理、用户管理的权限，且只能看到所管理的机构及其下子机构信息和用户信息，可对管理的机构和用户进行所有操作。   
5 **默认角色：** 默认可以看到自己创建和管理的应用、中间件信息，服务列表中只能看到可以看到应用下的服务信息。

如果我们要定义的角色很多时，一个个新增比较麻烦，我们支持导入导出功能。我们可以将其他应用的角色一键导出，然后批量导入到另外的应用中。

**编辑角色**

点击角色后面的 **编辑** 按钮可以对角色进行编辑操作，或者进入角色详情，点击角色名称或描述信息可进行修改。
角色名称和描述信息支持修改，角色编码不支持修改。

**关联功能**

点击角色后面的 **关联功能** 按钮可将角色关联功能。如下图所示：  
![guide-addrole](assets/images/doc/roleAndfuncational.jpg)   

勾选要授权的资源，点击 **确定** 按钮完成授权。该角色则拥有了授予的资源权限，那么和该角色关联的用户集合下的所有用户则自动拥有授权给角色的权限了。 

**关联用户集合**

在角色详情中，我们可以将该角色授权管理员和授权用户集合操作。授权管理员的集合拥有该角色关联功能的管理权限，即该集合下的用户可以管理该角色关联的所有功能。授权用户集合时拥有该角色关联功能的访问权限，即该集合下的用户可以访问该角色关联的功能。       
这里授权管理的集合会自动添加到应用管理平台功能管理员角色下的授权用户集合中去，集合下的用户会自动添加到应用管理平台的可访问应用的用户列表中去。管理集合下的用户可访问应用管理平台。   
用户拥有某功能的可管理权限，不一定就可以访问。必须要授予了可访问权限才能访问。如下图所示，点击**授权的管理员** 下的 **选择用户集合**按钮可为该功能授予管理集合。点击**授权的用户集合**下的**选择用户集合**按钮，可为该功能授予访问权限。  
![guide-addrole](assets/images/doc/guide-function-usercollect.jpg) 

**用户集合**：用户集合是值一类用户的集合，包括机构、岗位、用户组等。


**功能**

“功能”是应用提供给用户使用的最小粒度的功能单元，一个功能由应用内一个页面及该页面关联的多个子元素(权限资源)组成。功能管理就是对功能单元的生命周期进行管理。
    
点击 **新增功能** 按钮可打开新增功能页，如下图所示：  
![guide-addmenu](assets/images/doc/guide-addfunc.jpg)   

功能类型包括web类型和app类型两种。选择不同的类型，需要新增的内容不同。

当功能类型选择web时，新增功能页显示如下：  
![guide-addmenu](assets/images/doc/guide-addfunction.jpg)  

功能新增完后，在功能列表中可以看到新增的功能。点击功能后面的 **新增** 按钮，可为该功能新增资源，包括页面、页面元素、内部服务、外部服务，以及自定义资源。

在功能列表中，点击功能名称，进入功能详情页。如下图所示：  

![guide-addmenu](assets/images/doc/guide-functiondetail.jpg)   

在功能详情页中，包括 **详情**、**日志**、**统计**三个TAB页。详情页中显示该功能的下级资源，已关联的角色，以及已授权的该功能的用户列表。

在功能详情页中，点击 **编辑** 按钮，可对该功能信息进行编辑操作； 点击 **删除** 按钮可将该功能删除。

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>我们应用管理平台中的所有页面按钮都进行了权限控制，只有授予了权限才能操作。平台默认的五类角色我们默认授予了相应的资源权限，用户也可根据实际需求进行修改。</p>
</div>

**导入导出**

在角色列表上方点击 **导出** 按钮，可将列表中的角色和角色关联的功能导出成txt文件，然后我们可以将导出的txt导入到其它应用中去。

![guide-addmenu](assets/images/doc/role-imp.jpg)   

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>1 导入时会将角色和资源，以及角色资源的关联关系一并导入;</br>2 如果同一个应用下存在相同编码的角色则该角色不允许导入，但该角色与资源的关联关系还是会导入。</p>
</div>


#### <span id = "app-service">服务</span>

这里主要是对该应用下的服务网关信息、对外提供的服务，以及可调用的外部服务进行管理。

![guide-app-service](assets/images/doc/guide-app-service.jpg)  

**网关信息**

网关信息中主要展示该应用的API-KEY、SECURITY，以及网关集群内地址、网关集群外地址、网关互联网地址。

![guide-app-gateway](assets/images/doc/guide-app-gateway.jpg)  

API-KEY、SECURITY：应用创建时会生成默认的API-KEY和SECURITY，可以以点击 **重置凭证** 进行重置操作。 API-KEY和SECURITY默认是加密显示，点击后面的![guide-app-view](assets/images/doc/guide-app-view.jpg) 按钮可查看具体信息。  

如果我们创建的应用是走网关的，则我们需要将api-key及网关内容在应用的环境变量中进行配置，如下图所示。如果创建的应用不走网关则直接跳过该步骤。  
![guide-api-env](assets/images/doc/guide-api-env.jpg)  

具体配置项如下：
- c2_sso_proxy_apigateway_schema：一般都为http
- c2_sso_proxy_apigateway_host：服务网关地址，分内网地址和公网地址，我们可以从第一个图所示的服务集成中可以看到，根据实际情况进行配置；
- c2_sso_proxy_apigateway_port：服务网关的端口号，同样可以从服务集成下可以看到；
- c2_sso_proxy_apigateway_apikey：apikey即上面API-KEY对应的值。

**对外提供的服务**

对外提供的服务列表中显示该应用可对外提供的服务，我们可以通过 **批量导入** 或者 **单个添加**两种方式添加服务。  
具体操作请参考服务管理。

**可调用的外部服务**
这里对应用可调用的外部服务的授权。


#### <span id = "app-logs">日志</span>

**运行日志**

在应用下的“日志”Tab页中，我们可以查看该应用的后台日志信息，如下图所示。我们可以通过选择容器、副本、行数等条件来查看相应的日志信息。 可以通过是否勾选 **定时刷新** 来决定日志是否定时刷新。    
![guide-applogs](assets/images/doc/guide-applogs.jpg)    
其中：日志中error的内容用红色标识，warn内容用黄色标识。 
- 容器：如果存在多个容器，在这里可以选择要查看日志的容器名称；
- 副本：当应用存在多个副本时，可以选择要查看日志的副本；
- 行数：显示最新的设定行数的日志信息，用户可以根据自己需要来设定要显示的日志行数，默认设置为100行；
- 定时刷新：是否定时刷新，默认勾选定时刷新。

**变更日志**

变更日志中显示的是对象的操作日志信息，主要记录谁什么时间对该应用做了什么操作。包括操作对象类型、操作对象名称、操作类型、操作内容、操作人、IP、时间以及状态。

![guide-transaction](assets/images/doc/guide-bglogs.jpg) 

**事件**

事件列表中记录了该应用的事件信息，包括应用创建过程中镜像的拉取、资源分配、以及应用的启停操作等。

![guide-transaction](assets/images/doc/guide-event.jpg) 


#### <span id = "app-transactions">事务</span>

只有应用开启了性能监控才会显示事务TAB页，如下图所示。  
![guide-transaction](assets/images/doc/guide-transaction.jpg)  

页面上方显示请求情况，选中请求，在页面下方显示该请求的调用栈及调用链信息，如下图所示。  
![guide-dyz](assets/images/doc/guide-dyz.jpg)  

#### <span id = "app-setting">设置</span>

**性能监控：**

如果应用需要开启性能监控，则开启这里的开关。  
![guide-apm.jpg](assets/images/doc/guide-apm.jpg)  
开启性能监控后，系统自动注入两个环境变量，如下图所示：  
![guide-openapm](assets/images/doc/guide-openapm.jpg)  
- APM_COLLECTOR_IP：系统设置中设置的性能监控地址；
- APM_APP_NAME：自动生成一个name,由环境CODE_应用CODE组成。
只有开启了性能监控，在应用概览页中的性能监控数据才会显示，还有事务TAB页还会显示。

**应用删除：**

在应用设置页中，点击 **删除**按钮可将应用删除。删除页中需要将应用CODE手动填入，进行二次确认后才能删除。

![del-app](assets/images/doc/del-app.gif) 

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>1)删除应用时，应用相关的所有资源都会被删除，此操作不能够撤销 !</br> 2)如果删除应用挂载了存储卷，则删除应用时可以选择是否一并删除挂载的存储卷。</p>
</div>


### <span id = "app-stop">应用启动\停止</span>

在应用详情中，我们可以对应用镜像启动、停止操作。如下图所示。如果应用状态为“运行中”则显示的则为 **停止**按钮，如果应用状态为“停止”，则显示的为 **启动**按钮。启动应用后，我们可以到 **日志**TAB页中查看应用的启动日志信息。    
![guide-stopapp](assets/images/doc/guide-stopapp.jpg)    

<div class="warning custom-block">
    <p class="custom-block-title">注意</p> 
    <p>只有部署在我们平台的应用才能进行启动\停止操作，外部接入的应用不支持该操作。</p>
</div>

## 中间件管理

主要是对平台中的中间件进行管理。具体操作请参考应用管理。

## 服务管理

**本文索引：**  
- [服务列表](#service-list)
- [添加服务](#service-add)
- [批量导入](#service-import)
- [在线文档](#service-doc)
- [服务配置](#service-setting)
- [删除服务](#service-del)



### <span id = "service-list">服务列表</span>

这里是全局服务列表，显示所有应用注册的可对外提供的服务信息。我们可以通过直接创建或者导入服务的Swagger.json(应用需要依赖SwaggerAPI框架)方式来开放服务，开放的服务统一由API网关进行路由转发、鉴权控制。  

![guide-servicelist](assets/images/doc/guide-servicelist.jpg)    

我们可以通过 **应用&标签**、**服务名称**、**服务路径**、**请求方法**等对列表中的数据进行过滤。

### <span id = "service-add">添加服务</span>

![create-service](assets/images/doc/create-service.gif)   

点击列表上方的 **添加** 按钮，打开添加服务页，如下图所示。

![guide-addservice](assets/images/doc/guide-addservice.jpg)   

- 服务组：从下拉框中选择服务导入到的服务组；
- 服务名称：用户自定义，必填项；
- 服务路径：服务路径只支持相对路径（相对于API网关）
- 服务标签：给服务定义一个或多个标签，也可以创建新标签，必填项；
- 服务方法：选择添加服务的方法；
- 服务类型：包括私有服务、普通服务、公开服务三种类型。私有服务在【文档&调试】页中不会显示；私有服务和普通服务都需要授权才能访问；公开服务则不需要授权就能访问。
- 服务描述：对该添加的服务的描述信息。

点击 **确定**完成服务的添加操作，添加成功后，在服务列表中显示。

### <span id = "service-import">批量导入</span>

除了一个个手动添加服务外，我们还可以将服务通过swagger.json文档批量导入。如果是C2项目则只需要依赖相应组件就能直接生成Swagger.json文件即可。  
在服务列表中，点击列表上方的 **导入**按钮，打开服务导入向导页，包括三个步骤：服务录入、服务预览、导入\更新服务。下面我们对每个步骤进行详细介绍。  

**第一步：服务录入**  

导入方式包括直接导入swagger.json字符串和从swagger.json访问路径导入两种。如果选择为swagger.json字符串，则在下面json字符串后的文本域中直接输入json字符串内容。如果为swagger.json访问路径方式，则在接口路径后的文本框中输入swagger.json路径。如:http://172.17.87.35:30540/swagger.json  
目标服务组中选择服务要导入到的服务组。  
1. **Swagger.json字符串** 方式  
![guide-impservice](assets/images/doc/guide-impservice.jpg)

2. **Swagger.json访问地址** 方式  
![guide-impservice2](assets/images/doc/guide-impservice2.jpg)

**第二步：服务预览**  
在服务录入页中，点击 **下一步**跳转到服务预览页，如下图所示：  
![guide-serviceview](assets/images/doc/guide-serviceview.jpg)

在列表上方，我们可以通过点击 **已存在**、**可更新**、**可导入**、**全部**对列表中的服务进行过滤，也可以通过输入路径进行路径的查询。  
列表中显示导入的服务信息，状态列中显示该服务的可导入状态。如果该服务已经导入了，则显示为“已导入”。如果服务有改动，则显示为“可更新”。如果服务没有导入，则显示为“可导入”。我们可以点击服务后面的 **删除**对该条服务进行删除。  
勾选要导入的服务，点击 **下一步**按钮，跳转到导入/更新服务页。

**第三步：导入/更新服务**  
在服务导入页中，显示可更新和导入的服务的条数，点击 **更新**按钮，将可更新的服务更新。页面下方服务导入配置中，需要设置服务的公开类型，点击 **导入**按钮即可完成导入操作。  
![guide-serviceview](assets/images/doc/guide-seriveimp.jpg.jpg)

### <span id = "service-doc">在线文档</span>

如果要对服务进行在线查看，我们可以点击列表上方的 **在线文档**按钮，打开文档预览页。  
![guide-docview](assets/images/doc/guide-docview.jpg)  
在服务组下拉框中选择要预览服务所在的服务组，选择要预览的服务类型，点击 **预览**按钮，打开在线文档页，如下图所示：  
![guide-docview2](assets/images/doc/guide-docview2.jpg)
如果服务需要访问凭证，我们可以点击 **凭证信息**按钮添加凭证，包括API-KEY以及当前操作用户信息。  
我们也可以对单个服务查看在线文档，点击服务后面的 **在线文档**可打开该服务的在线文档进行查看。

### <span id = "service-setting">服务配置</span>

我们可以点击服务后面的 **更多**-**配置**，打开服务配置页，如下图所示：  
![guide-service-details](assets/images/doc/guide-service-details.jpg)  
在服务配置页中显示服务的基本信息、参数、权限，以及监控数据。  

**基本信息**  
在基本信息中显示服务名称、服务标签、所属应用、上下文、HTTP Method，以及请求路径等。  
点击服务名称，可对服务名称进行修改。点击标签后面的×删除已有标签，点击+可添加标签。  
点击上下文，可对上下文进行编辑。  
应用状态暂不显示，点击 **删除**可删除该服务。 

**参数**  
在参数TAB页中显示服务基本信息、请求参数和响应信息。  
![guide-service-par](assets/images/doc/guide-service-par.jpg)  
点击基本信息后的 **修改**按钮，可对基本信息进行修改操作。  
![guide-updateserviceinfo](assets/images/doc/guide-updateserviceinfo.jpg)  

**权限**  
在权限TAB页中显示该服务授权的应用，如下图所示：  
![guide-servicepri](assets/images/doc/guide-servicepri.jpg)  
在列表中显示该服务授权给的应用，点击列表中应用后面的 **取消授权**按钮可取消该应用的权限。  
点击列表上方的 **授权**按钮，可将该服务授权给其他应用，如下图所示：  
![guide-apppri](assets/images/doc/guide-apppri.jpg)  
在应用授权页中，勾选要授权的应用（可多选），点击 **确定**完成应用授权。


### <span id = "service-del">删除服务</span>

在服务详情页中，我们可以点击 **删除** 按钮，将该服务删除。  
![guide-delservice](assets/images/doc/guide-delservice.jpg)  


## 功能

**本文索引：**  
- [功能列表](#functional-list)
- [授权用户](#functional-user)
- [设置管理员](#functional-mgr)


“功能”是应用提供给用户使用的最小粒度的功能单元，一个功能由应用内一个页面及该页面关联的多个子元素(权限资源)组成。功能管理就是对功能单元的生命周期进行管理。

### <span id = "functional-list">功能列表</span>

功能列表显示当前用户通过角色授权后能够访问的功能数据。列表中显示功能名称、功能所属应用，所属角色，以及功能管理员和该功能已授权的用户集合。和应用下的功能列表不同的是，这里显示的是全局的功能列表。包括所有应用的功能信息。平台管理员可以看到所有的功能信息，而普通用户只能看到自己可管理的功能信息。  

![guide-delservice](assets/images/doc/guide-functionalList.jpg)

在功能列表中，点击功能名称、所属应用名称、所属角色都可以进入其详情页。

### <span id = "functional-user">授权用户</span>

功能授权用户，其实是通过功能关联角色，然后将角色授权用户集合，则该用户集合下的用户自动拥有所在角色所关联的所有功能的访问权限。在功能列表中，点击要授权功能后面的 **授权用户** 按钮，打开角色授权用户设置页，如下图所示：

![guide-delservice](assets/images/doc/guide-roleTouser.jpg)

页面中显示选中功能关联的所有角色，点击**查看角色权限详情**可打开角色权限详情页，在页面中可对权限进行查看修改。点击**查看影响的用户**可打开角色授权的用户列表，查看该角色已关联的用户信息。选择要授权用户的角色，点击**添加授权**按钮可打开角色授权用户设置页，如下图所示。用户集合包括机构、岗位、用户组。

![guide-delservice](assets/images/doc/guide-roleusers.jpg)


### <span id = "functional-mgr">设置管理员</span>

和授权用户不同的是，这里设置的管理员可拥有所在角色所关联功能的管理权限。功能列表中只会显示当前登录用户可管理的所有功能。其具体操作请参考授权用户。


## 全局导航

**本文索引：**  
- [创建目录](#navigation-createlog)
- [关联功能](#navigation-functional)


全局导航是将有权管理的功能关联到不同目录下，以生成功能树，达到有效导航。

![guide-delservice](assets/images/doc/guide-global-navi.jpg)

### <span id = "navigation-createlog">创建目录/span>

所有功能都是挂载在目录下的，我们可以根据实际需求，将不同的功能挂载到不同的目录下。点击全局导航上方的 **创建目录** 按钮，可打开创建菜单目录页，如下图所示：  

![guide-delservice](assets/images/doc/guide-global-menu.jpg)

根目录显示用户所选的目录名称，如果没有选择任何目录，则显示为根目录。

### <span id = "navigation-functional">关联功能/span>

目录创建好后，用户就可以在目录下关联功能了，点击列表上方的 **关联功能** 按钮，右边弹出选择功能添加到导航目录页，页面中默认显示未设置为菜单的功能。我们也可以取消**隐藏已经设置为菜单的功能**来显示所有的功能信息。支持通过功能名称和应用名称进行过滤。    
在列表中勾选要导入的功能，点击下方的 **添加到导航** 按钮，可将选中的功能添加到导航目录。在我们的门户中显示的就是这里关联的导航目录信息。

![guide-delservice](assets/images/doc/guide-global-function.jpg)

目录下的功能可以通过点击上方的**上移** 和 **下移** 按钮来设置功能显示顺序。


## 机构用户

**本文索引：**

- [机构管理](#organization)
- [用户管理](#user)
- [用户组管理](#usergroup)
- [维度管理](#meta)
- [字典管理](#dictionary)

### <span id = "organization">机构管理</span>

机构管理提供了管理机构信息的功能，同时展示机构下的所有用户数、岗位信息、机构管理员。可通过机构名前面的“+”按钮展开下级机构，通过单击**管理人员**即可进入到用户管理页面。

![orguser-addorg](assets/images/doc/guide-orglist.jpg)

**创建机构**

在机构管理页，在页面上方选择要添加机构的分类机构，下方列表中显示该分类机构下的所有机构信息，点击**创建机构**，打开新增机构页，如下图所示：
![orguser-addorg](assets/images/doc/orguser-addorg.jpg)

<div class="warning custom-block">
    <p class="custom-block-title">注意：</p> 
    <p>选择的机构维度不同，新增机构页中显示的属性信息也会不同。新增机构页中显示的属性与所在的机构维度配置的机构类型属性相同。</p>
</div>

**添加子机构**

在机构管理页，选择列表操作列的**更多**-**添加子机构**，打开子机构新增页，具体操作详见 **创建机构**。

**编辑机构**

在机构管理页，选择列表操作列的**更多**-**编辑**，打开机构编辑页，对机构信息进行编辑操作。我们也可以点击 **查看** 按钮进入机构详情页，点击 **编辑**按钮对机构信息进行编辑。

**删除机构**

在机构管理页，选择列表操作列的**更多**-**删除**，弹出子机构删除确认窗口，确认后删除成功。   
也可以进入机构详情页，点击**删除**按钮进行机构的删除操作。

<div class="warning custom-block">
    <p class="custom-block-title">注意：</p> 
    <p>1.若删除的机构下存在子机构，子机构会一并删除。若机构下存在用户，删除机构后会把机构与用户的关联关系、当前机构下的用户实例、机构及子机构删除，用户基础数据保留。也就是说，如果用户存在于多个机构下，不会影响到其他机构；数据库中，会删除机构用户表、用户实例表、机构实例表、机构表中的相关数据，保存用户表中对应用户数据。</br>2.删除机构是物理删除，不可恢复，请谨慎操作。</p>
</div>

**<span id = "copytootherorg">复制至其他机构</span>**

在机构管理页，选择列表操作列的**更多**-**复制至其他机构**，如下图所示：   
![orguser-copytootherorg](assets/images/doc/orguser-copytootherorg.jpg)
- 源机构：当前所选分类机构。
- 级联复制：若源机构下存在子机构，勾选级联复制，可以将子机构一起复制到目标机构下。
- 目标机构：可选分类为维度管理中除当前分类外的其他所有的分类。选择一个分类，分类下的机构可以不选，若不选择，源机构直接复制到所选分类下， 若选择，源机构复制到所选分类的指定机构下。

**<span id = "movetootherorg">移动至其他机构</span>**
“移动至其他机构”可以将机构移动到所在机构维度下的其他机构下。上移/下移不能改变机构的层级关系，而移动至其他机构则是改变机构的层级关系。我们可以将本机构作为同一维度下的其他机构的子机构。

在机构管理页，选择列表操作列的**更多**-**移动至其他机构**，即可打开移动设置页，选择要移动到的机构。

- 机构移动操作只能同一维度的机构之间进行。
- 父机构不能移动到子机构下。

**<span id = "setorgmanager">设置管理员</span>**

在机构管理页，选择列表操作列的**更多**-**设置管理员**，如下图所示：   
![orguser-setorgmanager](assets/images/doc/orguser-setorgmanager.jpg)
- 可选用户：当前机构及所有子机构的用户。
- 机构管理员用户登录后，能够看到其所管理的机构和所有子机构，并且可以给其下所有的子机构设置机构管理员。

**管理人员**

在机构管理页，选择列表操作列的**管理人员**，进入用户管理，具体操作和说明请参考本手册[用户管理](#user)。

**查看机构详情**

在机构管理页，选择列表操作列的**查看**，进入机构详情页面，如下图所示。
机构详情页中，可以对机构基本信息、子机构、用户、岗位、机构权限等进行统一管理。  
![orguser-orgdetail](assets/images/doc/orguser-orgdetail.jpg)

#### 机构详情管理

在机构详情页中，复制机构、移动机构、删除机构、设置管理员、编辑、添加子机构等功能的具体操作请参考本手册[机构管理](#organization)。        

**可使用的应用**

在机构详情页中，选择**详情**TAB页，页面滚动到可使用的应用模块，该部分展示当前机构及其用户有权限访问的应用列表。

![orguser-orgdetail-apporg](assets/images/doc/orguser-orgdetail-apporg.jpg)

#### 用户管理

在机构详情页，选择**用户**TAB页，可以对当前机构及其子机构下的所有用户进行管理。

**<span id = usermanagement>添加到其他机构</span>**

在应用管理平台中，允许一个用户存在于多个机构下。通过添加到其他机构，将用户复制到相同或者不同维度的不同机构下。
在机构详情页，选择**用户**TAB页，选择列表操作列的**更多**-**添加到其他机构**，弹出用户添加到其他机构窗口，如下图所示：

![orguser-addusertootherorg](assets/images/doc/orguser-addusertootherorg.jpg)

- 目标机构：可选分类为维度管理中新增的所有分类。选择一个分类，可先机构为指定分类下的机构。

**移动到其他机构**

移动至其他机构可以将用户移动到所在机构维度下的其他机构下。移动之后，用户将不存在于源机构下。
在机构详情页，选择**用户**TAB页，选择列表操作列的**更多**-**移动到其他机构**，弹出用户移动到其他机构窗口，如下图所示：

![orguser-orgdetail-usermoveotherorg](assets/images/doc/orguser-orgdetail-usermoveotherorg.jpg)

**从机构移除**

在机构详情页，选择**用户**TAB页，选择列表操作列的**更多**-**从机构移除**，弹出移除用户确认窗口，勾选待移除用户的所属机构，确认后移除成功，如下图所示：

![orguser-orgdetail-removeuserfromorg](assets/images/doc/orguser-orgdetail-removeuserfromorg.jpg)

- 移除用户只是删除用户在指定机构下的实例数据，解除用户与机构的关联关系，不会影响用户数据。

**重置密码**

在机构详情页，选择**用户**TAB页，点击列表操作列的**更多**-**重置密码**的按钮，如下图所示：

![orguser-orgdetail-resetpwd](assets/images/doc/orguser-orgdetail-resetpwd.jpg)

用户被重置密码后，该用户的密码修改为环境变量中设置的默认密码。

**添加到岗位**

用户添加到相关岗位后，若岗位已被授予对应职责权限，那么用户也拥有这些权限。

在机构详情页，选择**用户**TAB页，点击列表操作列的**更多**-**添加到岗位**的按钮，打开用户关联岗位页面，如下图所示： 

![orguser-orgdetail-addtojob](assets/images/doc/orguser-orgdetail-addtojob.jpg)  

**查看用户详情**

在机构详情页，选择**用户**TAB页，点击列表操作列的**查看**的按钮，如下图所示。进入用户详情页。

![orguser-touserdetail](assets/images/doc/orguser-touserdetail.jpg)

点击列表**操作**按钮，弹出展示列选择窗口，如下图所示，只有勾选的属性才会显示在列表中。

![orguser-showcolumn](assets/images/doc/orguser-showcolumn.jpg)

#### <span id = "job">岗位管理</span>

岗位管理是将某一机构下，具有相似工作内容的一类用户按岗位进行分类管理。一个岗位下可关联的用户范围是当前机构及其所有子机构的用户。  
授予岗位对应职责权限后，拥有该岗位的用户也有相关权限。一个用户可以关联多个岗位，拥有的权限则为多个岗位下的权限之和。  
在机构详情页中，点击 **岗位** TAB页，可查看该机构下的岗位信息，如下图所示：

![orguser-showcolumn](assets/images/doc/guide-orgjob.jpg)

我们可以对岗位进行新建、编辑、删除，以及查看岗位详情操作。


<div class="warning custom-block">
    <p class="custom-block-title">注意：</p> 
    <p>删除岗位，岗位与用户的关联关系也会删除。若岗位被授予相关权限，岗位下的用户拥有的岗位权限会取消，但不会影响到用户数据。</p>
</div>


**添加用户**

在机构详情的岗位管理TAB页中，点击列表操作列的**添加用户**，打开用户添加岗位页面，如下图所示：

![orguser-addusertojob](assets/images/doc/orguser-addusertojob.jpg)

- 用户添加到相关岗位后，若岗位已被授予对应职责权限，那么用户也拥有这些权限。

**移除岗位下用户**

在机构详情的岗位管理TAB页中，选择一个岗位，展开岗位下的用户列表,点击用户列表操作列的**删除**。弹出移除岗位下的用户确认小窗口，确认后删除，如下图所示。

![orguser-removeusertojob](assets/images/doc/orguser-removeusertojob.jpg)

- 移除岗位下的用户，岗位与用户的关联关系删除。若岗位被授予相关权限，岗位下的用户拥有的岗位权限会取消，但不会影响到用户数据。

**查看岗位详情**

在机构详情的岗位管理TAB页中，选择一个岗位，点击操作列的**查看**按钮，进入岗位详情页，如下图所示：

![orguser-jobdetail](assets/images/doc/orguser-jobdetail.jpg)

在岗位详情页中，编辑岗位、删除岗位、添加用户、移除用户等功能的相关操作和说明请参考本手册[岗位管理](#job)。

**岗位权限**

在岗位详情页中，选择**权限**TAB页，显示该岗位授予的角色信息，以及该角色关联的功能。

![orguser-jobpermission](assets/images/doc/orguser-jobpermission.jpg)

**日志**

待补充.....

**机构权限**

在机构详情的权限管理TAB页中，主要展示该机构授予的角色及角色关联的功能信息。 
![orguser-orgpermission](assets/images/doc/orguser-orgpermission.jpg)

**操作日志**

待补充....


**导入导出**

我们可以通过导入导出操作，将机构用户导出到execl文件，也可以将excel中的机构用户信息导入到系统中来。


**<span id = "import">导入数据</span>**

我们可以将excel中的机构用户信息导入到平台中，支持xls和xlsx两种格式。  
首先，我们需要选择要导入的机构所在的分类，点击右侧列表上方的**下载模板**按钮来下载模板。模板下下来后，将要导入的数据写入execl中，就可以进行导入操作了。  
选择全局导入机构或者机构用户数据时，如果上传的模板中的机构没有指定机构的父机构id，或者指定的父机构id为当前维度分类，那么全局导入的机构会直接导入到当前分类下。  
在机构管理页中，点击右侧列表上方的**导入数据**，在打开的导入窗口，选择一个模板文件，点击**下一步**，跳转到预览页。在预览页中，分别展示模板中合法的机构、用户数据和非法数据。如下图所示：

![orguser-preview](assets/images/doc/orguser-preview.jpg)

再点击**导入**，弹出导入提示框，点击**确定**后，系统给出导入成功提示，本次导入操作完成。  
在预览数据时，如需要查看模板中的错误数据，单击**导出错误数据**，可以把错误数据的excel导到本地。  


***注意：***
- 模板中，标黄的列为必填项，若不填写，预览时这条数据会视为错误数据。
- 只导入机构或者只导入用户时，只需要填写机构sheet或者用户sheet。
- 机构id和pid可以不填,但不能填写会产生嵌套效果的数据。如下图所示：
![orguser-template-nesting](assets/images/doc/orguser-template-nesting.jpg)

- 机构id如果填写了已经存在的id，模板中的机构编码就必须和数据库中的数据一致。
- 若模板中没有填写上级机构id，机构默认导入到当前维度分类下；若填写合法的上级机构id，会导入到指定机构下；若上级机构id不合法，机构会视为错误数据。
- 模板中机构编码可以不填写，不能填写已经存在的机构编码。若模板中的机构编码已经存在，系统不认可以当前填写的机构，而是以数据库中机构编码对应的机构id为准。
- 单独导入用户：用户所属机构id和机构code可以选填或者不填。若都不填写，预览时，用户数据会视为错误数据。若填写了有效的机构id或者机构code，那么数据会导入到指定机构下。若都填写，机构id优先级高于机构code。
- 同时导入机构用户：规则与单独导入规则相同。此外，若用户sheet中指定的机构id或者机构编码为机构sheet中的有效数据，那么用户信息会导入到新增机构下。

如果只需要将数据导入到某一选择的机构下，则在机构管理页中，选择一个机构，点击操作列中的**更多**-**导入**，其他具体的操作和相关说明请参考[导入数据](#import)。  
导入规则与全局导入的规则相同，只是在单独导入机构或者用户信息时，若不指定机构，系统默认导入到当前机构下。

**导出**

在机构管理页中，选择一个机构，点击操作列中的**更多**—**导出**，如下图所示：  
![orguser-export](assets/images/doc/orguser-export.jpg)  
- 不勾选，直接点击**导出**，导出当前机构的机构数据。
- 勾选**级联导出**，导出当前机构及其所有子机构的机构数据。
- 勾选**同时导出机构用户**，导出当前机构的机构和用户数据。
- 勾选**级联导出**和**同时导出机构用户**，同时导出当前机构及其下所有层级的机构、用户数据。

### <span id = "user">用户管理</span>

用户管理是对机构下的用户进行统一管理。不同权限的用户登录，看到的数据会不同。如下图所示，选择分类机构和机构后，列表中显示该机构下的所有用户信息，默认不显示当前机构子机构下的用户信息，如果要看当前机构和子机构下的用户信息，勾选 **级联** 。   
![orguser-adduser](assets/images/doc/guide-userlist.jpg)

我们可以对用户进行创建、编辑、删除操作。点击列表上方的**创建**，打开新增用户页面，如下图所示：   
![orguser-adduser](assets/images/doc/orguser-adduser.jpg)
- 所属机构：指定用户添加到哪个机构下。

点击列表操作列的**查看**，打开用户详情页面。如下图所示：   
![orguser-touserdetail](assets/images/doc/orguser-touserdetail.jpg)

在用户管理页/用户详情页中，添加到其他机构、移动到其他机构、从机构移除、重置密码、添加到岗位等功能请参照本手册中的[添加到其他机构](#usermanagement)相关操作和说明，下载模板、导入数据、导出用户请参考[机构管理](#organization)。

全局导入：在选择分类和分类下的机构后，全局导入机构或者用户数据时，若模板中没有指定机构，数据会导入到列表上方所选机构下。

在用户详情的基本情况TAB页中，点击**编辑**，打开用户编辑页，如下图所示：

![orguser-edituser](assets/images/doc/orguser-edituser.jpg)

**权限**

在机构详情的权限管理TAB页中，展示用户所属机构、所属用户组、关联的岗位在可访问的应用中的角色权限和功能权限。

![orguser-userpermission](assets/images/doc/orguser-userpermission.jpg)

**日志**

待补充....

### <span id = "usergroup">用户组管理</span>

用户组是根据用户职责对用户进行分组管理，用户组是不属于任何机构的，我们可以将任意机构下的用户添加到同一个用户组。  
授予用户组对应职责的权限，用户组下的用户就拥有对应职责的权限。一个用户可以从属于多个用户组，该用户拥有的权限就是多个用户组的权限之和。

在用户组管理页中，点击列表上方的**新建**，打开用户组新增页，如下图所示：

![orguser-addusergroup](assets/images/doc/orguser-addusergroup.jpg)

在用户组管理页中，选择需要删除的用户组，点击**删除**，确认后删除成功。
删除用户组，用户组与用户的关联关系删除。若用户组已经被授予相关权限，用户组下的用户拥有的相关权限会取消，但是不会影响到用户数据。

选择一个用户组，点击**查看**，进入用户组详情页，如下图所示。用户组详情中，是集中对用户组基本信息、已关联用户、权限、日志进行管理。

![orguser-viewdetailofusergroup](assets/images/doc/orguser-viewdetailofusergroup.jpg)

在用户组详情页中，点击用户组名称和描述旁的**编辑**，可以编辑相关信息。如下图所示：

![orguser-editusergroup](assets/images/doc/orguser-editusergroup.jpg)

**导入用户**

在用户组详情页中，点击**导入用户**，打开导入用户页，如下图所示：

![orguser-addusertogroup](assets/images/doc/orguser-addusertogroup.jpg)

- 用户添加到用户组下后，若用户组已被授予对应职责权限，那么用户也拥有这些权限。

**移除用户组下的用户**

在用户组详情页中，点击用户列表中的**删除**，确认后移除成功。  
移除用户组下的用户，用户组与用户的关联关系删除。若用户组已经被授予相关权限，用户组下的用户拥有的相关权限会取消，但是不会影响到用户数据。

**查看用户详情**

在岗位管理中查看用户详情页，相关操作和说明请参考本手册[用户管理](#user)。

### <span id = "meta">维度管理</span>

维度管理模块提供对应用授权和机构用户属性管理操作，同时展示各个维度下的机构和用户数。  
通过维度管理，用户可以从多个维度对机构和用户进行分类管理。相同ID的机构、用户可以从属于不同的维度分类，但属性配置不同。

#### 维度管理

一个维度由顶级机构、维度、用户类型、机构类型构成。维度名称等于顶级机构名称、维度名。一个顶级机构下拥有不同的分类机构，一个分类机构可以属于不同的的顶级机构。

**创建组织架构维度**

在维度管理页中，点击**创建组织架构维度**，打开维度管理新增窗口。

![orguser-addmeta](assets/images/doc/orguser-addmeta.jpg)

- 顶级机构：在创建维度页中，点击**新增**可以创建顶级机构，也可以选择已有的顶级机构。

- 机构类型：可以点击**创建**自定义机构类型，也可以选择已有机构类型。

- 用户类型：可以点击**创建**自定义用户类型，也可以选择已有用户类型。

**编辑维度**

在维度管理页中，点击列表中的**编辑**，打开维度编辑页，如下图所示：

![orguser-editmeta](assets/images/doc/orguser-editmeta.jpg)

**删除维度**

在维度管理页中，点击列表中的**删除**，确认后删除成功。

**应用授权**

组织机构维度只有授予给了应用，应用才能对该维度下的机构用户信息进行读写操作。应用权限包括“拒绝”、“只读”、“读写”三种。
拒绝：表示该分类机构下的机构用户不允许应用访问；
只读：表示该分类机构下的机构用户信息只允许查询，不能进行写操作；
读写：表示该分类机构下的机构用户信息既可读，又可写。

在维度管理页中，点击列表中的**应用授权**，打开维度授权页，如下图所示：

![orguser-granttometa](assets/images/doc/orguser-granttometa.jpg)

除“机构用户平台”、“应用管理平台服务端”、“应用管理平台”应用默认为“读写”权限外，其余应用默认为“拒绝”权限。要给应用授予什么样的权限，直接勾选下面对应的勾选框即可。点击**关闭**按钮完成应用授权。


**注意：**
- 在部署应用时一定要注意，如果该应用用到了统一机构用户中的数据，记得在这里对应用授予需要访问的机构维度下的应用访问权限，否则会报错。
- 如果这里设置不方便，我们也可以直接在应用管理平台中进行设置。在应用下的“认证”Tab页中，设置“应用的机构用户数据权限”。

#### 数据类型管理

**编辑数据类型**

在维度管理页，选择一个数据类型，点击**编辑**，打开数据类型编辑页，如下图所示：

![orguser-editattributetype](assets/images/doc/orguser-editattributetype.jpg)

#### <span id = "usertype">用户类型管理</span>

**新增用户类型属性**

在维度管理页中，选择一个维度，点击用户类型旁的**新增**，打开属性新增页，如下图所示：

![orguser-addattribute](assets/images/doc/orguser-addattribute.jpg)

**编辑用户类型属性**

在维度管理页中，选择一个维度，展开用户类型，点击属性列表中**编辑**，打开属性编辑页，如下图所示：

![orguser-editattribute](assets/images/doc/orguser-editattribute.jpg)

**删除用户类型属性**

在维度管理页中，选择一个维度，展开用户类型，点击属性列表中**删除**，打开属性删除页，如下图所示：

![orguser-delattribute](assets/images/doc/orguser-delattribute.jpg)

***注意：***

- 对于继承的属性，不予许进行删除操作，自有属性，则允许删除。 
- 在删除属性时，如果其他分类下也关联了这个数据类型，这个分类下的这个属性也会被删除。

#### 机构类型管理

机构类型管理中包含新增机构类型，修改机构类型名称，新增、编辑、删除机构类型下的属性等功能，相关操作和说明请参考[用户类型管理](#usertype)。

### <span id = "dictionary">字典管理</span>

字典管理中是对系统用到的字典数据进行管理。包括字典的创建、编辑、删除，以及字典数据的管理。

在字典管理页中，点击列表上方的**创建字典**，如下图所示：

![orguser-adddict](assets/images/doc/orguser-adddict.jpg)

- 编码：唯一，必填项。
- 名称：唯一，必填项。
- 来源：字典数据的来源。
- 描述：可选项。


在字典管理页，点击右侧列表中的**编辑**，可以字典数据进行编辑操作。点击**删除**按钮可将选中的字典删除。

字典添加完成后，我们就可以在字典下添加属性了。单击管理属性旁的 **+** 就可以添加属性了，如下图所示：
![orguser-adddictdata](assets/images/doc/orguser-adddictdata.jpg)
- 显示名：属性名称，必填项。
- 值：属性名称对应的值。
- 选项分组：将属性进行分组，在实例化这一字典时，属性会按照分组进行展示。
- 排序号：属性排序的字段。

在字典管理页中，展开字典属性列表，单击列表中的**编辑**，可对属性信息进行编辑。单击属性后面的**删除**按钮，可将该属性删除，如下图所示：

![orguser-deldictdata](assets/images/doc/orguser-deldictdata.jpg)

- 设为默认值的属性不允许删除。普通属性则允许删除。
- 删除属性后，若对应字典已经在机构类型或者用户类型中创建字典属性，在新增机构或者用户时，对应属性可选的下拉列表中，没有删除的那一项。

**设置默认值**

字典属性设置为默认值后，在实例化对应字典属性下拉框中，会显示指定的默认值。

在字典管理页中，展开字典属性列表，单击列表中的**设为默认值**，如下图所示：

![orguser-setdefault](assets/images/doc/orguser-setdefault.jpg)

**属性上下移动**

在字典管理属性列表页，单击列表中的**上移**，属性的位置上移一位。在实例化对应字典属性下拉列表中，对应显示名也上移一位。

在字典管理属性列表页，单击列表中的**下移**，属性的位置下移一位。在实例化对应字典属性下拉列表中，对应显示名也下移一位。


## 高级设置

**本文索引：**  
- [租户](#tenant)
- [域名](#domain)
- [集群](#cluster)
- [镜像](#images)
- [存储卷管理](#volumes)
- [许可信息](#license)
- [日志](#log)
- [系统设置](#setting)



### <span id = "tenant">租户</span>

租户管理是对平台中的租户进行管理，在租户列表中显示平台中的所有租户信息。如下图所示：   

![guide-tenantlist](assets/images/doc/guide-tenantlist.jpg)  

租户列表中显示平台中的所有租户和各租户的资源情况以及租户下的应用、用户数据的统计。  
点击租户后面操作栏中的 **查看** 可打开租户详情页。

**新建租户**

在租户列表中，点击 **新建** 按钮，打开新增租户页，如下图所示：  
![guide-addtenant](assets/images/doc/guide-addtenant.jpg)  

在新增租户页中，我们可以直接租户名称和租户编码，或者，我们也可以点击 **选择机构** 按钮，打开机构选择页，显示所有的机构信息，用户选择要设置租户的机构，在新增租户页中自动显示选择机构的信息，**租户名称** 显示为机构名称， **租户编码** 显示为机构编码，用户也可以根据实际情况进行修改。  
点击 **确定** 完成租户的新建操作，新建的租户在租户列表中显示。

### 租户配额

待补充……


### 用户管理

用户管理是对平台中的用户进行管理。用户是存在于租户下的。用户必须存在于租户下，当用户登录平台时，才允许登录，且登录后显示当前用户所在的所有租户。  
在租户列表中，点击租户后的 **查看** 按钮进去租户详情，点击 **用户** TAB页，显示该租户下的所有用户信息。  
我们可以通过 **添加用户** 和 **导入用户** 两种方式来添加用户。

**添加用户**  
在用户管理页中，点击 **添加** 按钮，打开新增用户页，如下图所示：  
![guide-tenant-adduser](assets/images/doc/guide-tenant-adduser.jpg)  

**导入用户**  
除了自己新增用户，我们也可以直接将机构用户管理平台中的用户导进来。在用户管理页中点击 **导入** 按钮，打开导入用户页，页面中显示机构用户中的所有用户信息，通过姓名进行过滤，勾选要导入的用户，点击 **确定** 完成用户的导入。  
![guide-tenant-impuser](assets/images/doc/guide-tenant-impuser.jpg)  



### <span id = "domain">域名</span>

这里主要是对系统中的所有域名进行统一管理。

![guide-tenant-adduser](assets/images/doc/global-domain.jpg) 




### <span id = "cluster">集群</span>

管理应用管理平台可使用的集群和主机资源。集群是应用运行所需的主机的集合。可以是单个或者多个物理机器，虚拟机器。  
集群是分租户管理的，集群页面只显示当前登陆用户所属的租户下所有用户创建的集群,并可对其进行操作，不能查看其它租户的用户创建的集群数据及操作。但是集群是不分环境的，租户下的所有环境都共用集群。   
集群分公共集群和私有集群两种，公共集群所有租户都可以使用，而私有集群则只允许本租户使用。只有管理租户下可以创建公开集群，其他租户下只能创建私有集群。  
**新建集群**  
在集群管理页中，点击**新增集群**，如下图所示：  
![guide-addcluster](assets/images/doc/guide-addcluster.jpg)    
打开新建集群页，输入集群名称，如果是在管理租户下，页面中还会显示**是否公开集群**的勾选项，勾选了则所建集群为公共集群，所有租户都可以使用。如果没有勾选，则所建集群为私有集群，只有本租户可以使用。  
**新增主机**  
集群建好后，我们就要在集群中添加主机了。新增主机主要包括三个步骤：    
- 步骤一：安装docker  
如果添加的主机没有安装docker，请按照页面上的步骤进行安装，如果主机已经安装docker，则直接跳过该步骤。  
```
curl -sS http://s3.c2cloud.cn/k8s-builder/install-docker.sh | sh -s {master-ip} 
```
- 步骤二：配置存储驱动  
配置docker存储驱动为devicemapper direct-lvm，此步骤可选，建议生产环境配置。请按照步骤一步步进行配置，如果不需要配置则直接跳过此步骤。
1. 磁盘分区  
```
fdisk /dev/vdb#/dev/vdb为新挂载的设备块
Command (m for help): n    # n表示新建一个新分区。
出现“First cylinder(n-xxx, default m) ：”表示要你输入的分区开始的位置。直接回车选择默认值
出现“Last cylinder or +size or +sizeM or +sizeK (n-xxx, default xxx):”表示分区的结束位置。直接回车选择默认值
Command (m for help): wq            # 保存信息
fdisk -l /dev/vdb                   # 查看硬盘/dev/vdb的信息
```
2. 创建逻辑卷
```
pvcreate /dev/vdb1 
vgcreate docker /dev/vdb1
lvcreate --wipesignatures y -n thinpool docker -l 95%VG
lvcreate --wipesignatures y -n thinpoolmeta docker -l 1%VG
lvconvert -y --zero n -c 512K --thinpool docker/thinpool --poolmetadata docker/thinpoolmeta
```
3. 修改配置文件
```
vi /etc/lvm/profile/docker-thinpool.profile 
activation {
   thin_pool_autoextend_threshold=80
   thin_pool_autoextend_percent=20
}
lvchange --metadataprofile docker-thinpool docker/thinpool        # 添加新的lv profile
lvs -o+seg_monitor
```
4. 修改Docker启动参数ExecStart，重启Docker
```
vi /usr/lib/systemd/system/docker.service
ExecStart=/usr/bin/dockerd $OPTIONS --bip=192.168.1.1/16 \
  --storage-driver=devicemapper \
  --storage-opt=dm.thinpooldev=/dev/mapper/docker-thinpool \
  --storage-opt=dm.use_deferred_removal=true \
  --storage-opt=dm.use_deferred_deletion=true
sudo systemctl restart docker            # Docker重启
```
- 步骤三：加入集群  
前面准备工作做好了，我们就可以将该主机加入到集群中来了。在 **请输入主机IP** 后的文本框中输入主机的IP地址，然后在主机上运行命令：  
```
curl -sS http://s3.c2cloud.cn/k8s-builder/install.sh | sh -s 1fb5ad.ecf6771fe444cc7c {主机ip} {master-ip}
```
执行上面的命令后，当看到您的主机输出【 Run 'kubectl get nodes' on the master to see this machine join.】后，点击加入集群按钮，将主机加入集群。   

### <span id = "images">镜像</span>

镜像，是创建应用的基础。镜像分为两类：  
- 平台镜像：即平台提供的公共镜像，所有租户都可以使用；
- 我的镜像：租户自己通过镜像构建功能创建的镜像，只能租户自己使用；

![guide-images](assets/images/doc/guide-images.jpg)    
我的镜像是分租户管理的。该页面只显示当前登陆用户所属的租户下所有用户push的镜像并可对其进行操作，不能查看其它租户的用户push的镜像并做相关操作。  

**新建镜像**  
我们可以将war包编译成镜像，上传到镜像仓库。  
在**我的镜像**中，点击最后的**新增镜像**，如下图所示：    
![guide-addimages](assets/images/doc/guide-addimages.jpg)   
可打开 **上传程序包&编译镜像** 页:  
![guide-uploadwar](assets/images/doc/guide-uploadwar.jpg)  
具体操作请参考

**上传镜像到镜像仓库**  
上传私有镜像到仓库的前提是租户自己制作或者从公共仓库pull的docker标准镜像。上传镜像所做的以下操作均需要在安装了docker软件的Linux的机器。
1. 首先找到要上传的镜像（以mysql为例）并打上平台镜像的tag。
```
docker tag docker.io/mysql:5.7.17 registry.c2cloud.cn/csqyzh/mysql:5.7.17
```
其中：  
- docker.io/mysql:5.7.17为原始镜像，需要上传到我们镜像仓库的镜像
- registry.c2cloud.cn/csqyzh/mysql:5.7.17为我们的镜像仓库支持的格式，registry.c2cloud.cn为镜像仓库地址，csqyzh为创建租户时配置的租户标识，mysql:5.7.17为镜像文件:镜像版本号
2. 登录镜像仓库  
```
[root@k8s_slave1 ~]# docker login https://registry.c2cloud.cn/
Username (gxqdeveloper): csqyusr
Password: 
Email: 
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
```
3. 上传镜像到镜像仓库
```
docker push registry.c2cloud.cn/csqyzh/mysql:5.7.17
```
**更新镜像**  
在我的镜像中显示的镜像，我们可以对其进行更新操作。此操作只适应于将war包打成镜像的情况。  
点击镜像下方的更新按钮，如下图所示：  
![guide-updateimages](assets/images/doc/guide-updateimages.jpg)   
打开镜像更新页，显示如下：  
![guide-uploadwar](assets/images/doc/guide-uploadwar.jpg)  




**镜像详情**  
在镜像列表中，点击镜像图标可进去镜像详情页，如下图所示：   
![guide-imagedetails](assets/images/doc/guide-imagedetails.jpg)

镜像详情页最上方显示镜像基本信息，点击**镜像分类**下拉框，可以进行分类的修改，点击**描述**可编辑镜像描述信息，点击**保存**完成编辑操作。


### <span id = "volumes">存储卷管理</span>

当某个租户创建应用的时候有持久化数据需要的时候，使用存储卷去保存持久化数据，即将存储卷挂载到应用的某个需持久化的目录，这样应用在运行中在该目录下产生的应用数据就会保存到对应的存储卷，当应用停止或者删除后数据不会丢失，除非将存储卷删除。
存储卷是分租户管理的。存储卷页面只显示当前登陆用户所属的租户下所有用户创建的存储卷,并可对其进行操作，不能查看其它租户下的用户创建的存储卷数据并做操作。  
![guide-volsetting](assets/images/doc/guide-volsetting.jpg)  
在存储卷列表中，已挂载的存储卷可以点击 **查看**查看具体信息，没有挂载的存储卷可点击 **删除**按钮进行删除操作。删除后默认会保留7天，7天内都可以恢复。



### <span id = "license">许可信息</span>

这里是全局应用许可，租户下的所有应用都可以共享这个许可。C2应用部署过程中可以选择使用共享许可来验证应用权限。  
![guide-license](assets/images/doc/guide-license.jpg)   
点击 **更新许可**，打开更新许可信息页，如下图所示：  
![guide-updatelicense](assets/images/doc/guide-updatelicense.jpg)   
- 备注：输入任意备注信息；
- license上传：上传可共享的license。



### <span id = "log">日志</span>

这里是显示全局日志，包括系统中所有应用的日志信息。我们可以通过应用、操作对象、操作类型、操作人、操作时间等对日志进行过滤查询。

![guide-updatelicense](assets/images/doc/global-logs.jpg)   



### 系统设置
应用管理平台系统设置界面，提供全局参数、系统环境相关配置。  
![guide-setting](assets/images/doc/guide-setting.jpg)   

### <span id = "setting">平台设置</span>

平台设置是对平台中的全局信息进行设置。点击后面的 **编辑** 按钮可对平台设置进行修改。  
![guide-setting-plat](assets/images/doc/guide-setting-plat.jpg)

- 管理租户CODE：一般管理租户都为admin；
- 性能监控地址：配置apm性能监控地址；
- 全局资源监控地址：配置为Prometheus连接的grafana的地址；
- 是否启用pass：如果关闭该开关，则系统不会调用cce的接口，即不可部署应用，只能创建外部应用；
- 部署内网地址：cce应用所在环境的网关地址（8000端口映射的）；
- 系统管理员：这里设置的管理员为平台管理员，和在平台管理员用户组下添加的用户权限一样。点击任意用户名可添加或删除已经设置的管理员。

**环境配置** 

点击环境后面的 **编辑** 按钮，可对环境配置信息进行修改操作。包括基本信息、网关信息、特性、所属租户，以及全局路由等配置。如下图所示：

![guide-setting-env](assets/images/doc/guide-envupdate.jpg)

基本信息：
- 名称：自定义的环境名称；
- 编码：自定义的环境编码，开启性能监控后注入环境变量中会使用该编码，如果修改后，需要手动修改已经注入的环境变量值；
- 授权服务器地址：统一认证的授权服务器的地址，即应用管理服务的访问地址；
- 授权服务器内网地址：统一认证的授权服务器的内网地址，即应用管理服务的内网地址；

网关配置：
- 网关协议：http或者https;
- 网关地址：网关服务IP地址或者域名地址；
- 网关端口：配置网关的8000端口，或者是8000端口映射的外网端口；
- 网关管理端口：网关8001端口，或者是8001端口映射的外网端口；

特性：
- SpringCloud支持:如果需要支持SpringCloud，则开启该开关，在注册中心地址中配置部署的注册中心地址。

所属租户：显示可以看到该环境的租户信息，我们可以点击 **新增所属租户** 按钮来为该环境添加租户，只有这里配置的租户才能看到该环境。

全局路由：全局路由开启后，在路由管理地址中配置路由8001端口映射的外网地址。路由模板列表中可配置路由模板，这里配置的模板在应用添加域名时可以进行选择。

![guide-setting-env](assets/images/doc/setting-routesetting.jpg)


**禁用环境**

除了主环境外，其余非主环境我们都可以进行禁用操作。禁用后的环境就不会在环境切换时显示了，全局监控中也不会调用禁用的环境的请求了。

![guide-setting-env](assets/images/doc/setting-envjy.jpg)

**接入已有环境**

平台中只有一个环境为主环境，非主环境可以有多个，如果已经部署好了其它环境，我们可以通过点击 **接入已有环境** 来添加环境。

**部署新环境**

我们还可以通过点击 **部署新环境** 按钮来部署一个新环境。部署新环境的前提是chart已部署完成，且数据库初始化已完成。

