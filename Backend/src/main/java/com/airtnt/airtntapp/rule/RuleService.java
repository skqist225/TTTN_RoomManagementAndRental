package com.airtnt.airtntapp.rule;

import java.util.Iterator;
import java.util.List;

import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.entity.Rule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RuleService {
    private final String DELETE_SUCCESSFULLY="Delete Rule Successfully";
    private final String DELETE_FORBIDDEN="Could not delete this rule as it's being used by rooms";

    @Autowired
    RuleRepository repo;

    public List<Rule> listAll() {
        return (List<Rule>) repo.findAll();
    }

    public Iterator<Rule> listAllRule() {
        return repo.findAll().iterator();
    }

    public Rule getById(Integer id) {
        return repo.findById(id).get();
    }

    public Rule save(Rule Rule) {
        if (Rule.getId() != null) {
            Rule RuleDB = repo.findById(Rule.getId()).get();
            if (Rule.getIcon() == null)
                Rule.setIcon(RuleDB.getIcon());
            ;
            return repo.save(Rule);
        }
        return repo.save(Rule);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            repo.deleteById(id);
            return DELETE_SUCCESSFULLY;
        }catch(Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public String checkName(Integer id, String name) {
        Rule rule = repo.findByTitle(name);

        if (rule == null)
            return "OK";

        if (id != null && rule.getId() == id)
            return "OK";

        return "Duplicated";
    }

}
