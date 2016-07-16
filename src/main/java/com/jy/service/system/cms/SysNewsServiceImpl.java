package com.jy.service.system.cms;

import com.jy.entity.system.cms.SysNews;
import com.jy.repository.system.cms.SysNewsDao;
import com.jy.service.base.BaseServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author gsw on 16-7-11
 * @version 1.0
 */
@Service("SysNewsService")
public class SysNewsServiceImpl extends BaseServiceImp<SysNews> implements SysNewsService {
  @Autowired
  private SysNewsDao sysNewsDao;
}
